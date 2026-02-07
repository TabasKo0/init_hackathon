import { NextResponse } from 'next/server'

const DEFAULT_RANGE = 'Sheet1!C:C'

export async function POST(request) {
  const { email } = await request.json()
  const normalizedEmail = String(email || '').trim().toLowerCase()

  if (!normalizedEmail) {
    return NextResponse.json({ exists: false })
  }

  const sheetId = process.env.SHEET_ID
  const apiKey = process.env.GOOGLE_API_KEY
  const range = process.env.SHEET_RANGE || DEFAULT_RANGE

  if (!sheetId || !apiKey) {
    return NextResponse.json({ error: 'Missing SHEET_ID or GOOGLE_API_KEY' }, { status: 500 })
  }

  const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`

  try {
    const response = await fetch(sheetUrl, { cache: 'no-store' })
    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to fetch sheet' }, { status: 500 })
    }

    const payload = await response.json()
    const values = Array.isArray(payload.values) ? payload.values : []

    const rows = values.length > 1 ? values.slice(1) : []
    const exists = rows.some((row) => {
      const sheetEmail = String(row?.[0] || '').trim().toLowerCase()
      return sheetEmail === normalizedEmail
    })

    return NextResponse.json({ exists })
  } catch (error) {
    return NextResponse.json({ error: 'Unable to verify registration' }, { status: 500 })
  }
}
