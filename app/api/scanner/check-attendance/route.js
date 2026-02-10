import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const SHEET_RANGE = 'Attendance!A:F'

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const rawPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, '\n') : ''

  if (!clientEmail || !privateKey) {
    throw new Error('Missing service account credentials.')
  }

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claimSet = {
    iss: clientEmail,
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  }

  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(claimSet)
  )}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()
  const signature = signer.sign(privateKey)
  const jwt = `${unsignedToken}.${base64UrlEncode(signature)}`

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text().catch(() => '')
    throw new Error(`Unable to fetch service account token. ${errorText}`.trim())
  }

  const tokenPayload = await tokenResponse.json()
  if (!tokenPayload?.access_token) {
    throw new Error('Missing access token from Google.')
  }

  return tokenPayload.access_token
}

export async function POST(request) {
  try {
    let payload = null

    try {
      payload = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
    }

    const userId = String(payload?.userId || '').trim()
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId.' }, { status: 400 })
    }

    const sheetId = process.env.SHEET_ID
    if (!sheetId) {
      return NextResponse.json({ error: 'Missing SHEET_ID' }, { status: 500 })
    }

    let accessToken = ''
    try {
      accessToken = await getGoogleAccessToken()
    } catch (tokenError) {
      return NextResponse.json(
        { error: tokenError.message || 'Failed to authenticate with Google.' },
        { status: 500 }
      )
    }

    // Read all rows from Attendance sheet
    const readResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_RANGE}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!readResponse.ok) {
      const errorData = await readResponse.json()
      console.error('Google Sheets read error:', errorData)
      // Sheet might not exist yet, so user is not present
      return NextResponse.json({ present: false })
    }

    const data = await readResponse.json()
    const rows = data.values || []

    // Skip header row (index 0) and check if userId exists in column A
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === userId) {
        return NextResponse.json({ present: true })
      }
    }

    return NextResponse.json({ present: false })
  } catch (error) {
    console.error('Check attendance API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    )
  }
}
