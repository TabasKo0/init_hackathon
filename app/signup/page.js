'use client'

import Link from 'next/link'
import { signup } from '../login/actions'
import { useState } from 'react'

export default function SignupPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    const userEmail = formData.get('email')
    setEmail(userEmail)

    try {
      await signup(formData)
      setShowConfirmation(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_18%_18%,rgba(255,64,243,0.16),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(33,246,255,0.2),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(10,8,28,0.4),transparent_48%),#040008] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="card glass shadow-xl">
            <div className="text-center">
              <div className="text-5xl mb-4">✓</div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Account Created!</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We've sent a confirmation email to <span className="font-semibold text-[#21f6ff]">{email}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Please check your email and click the activation link to complete your signup.
              </p>

              <div className="space-y-3">
                <Link href="/" className="block w-full rounded-lg bg-gradient-to-r from-[#ff40f3] to-[#21f6ff] px-4 py-3 font-semibold text-black shadow-[0_0_24px_rgba(255,64,243,0.55)] hover:shadow-[0_0_32px_rgba(33,246,255,0.5)] transition transform hover:scale-[1.02]">
                  Back to Home
                </Link>
                <Link href="/login" className="block w-full rounded-lg border-2 border-[#21f6ff] px-4 py-3 font-semibold text-[#21b8ff] dark:text-[#21f6ff] hover:bg-[#21f6ff10] dark:hover:bg-[#21f6ff12] transition">
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_18%,rgba(255,64,243,0.16),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(33,246,255,0.2),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(10,8,28,0.4),transparent_48%),#040008] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card glass shadow-xl">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Welcome</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Sign up for your Init account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-white">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border-2 border-[#ff40f3] dark:border-[#b500b4] bg-white dark:bg-black px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-[#21f6ff] focus:ring-2 focus:ring-[#21f6ff55] dark:focus:ring-[#21f6ff33] transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-900 dark:text-white">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border-2 border-[#ff40f3] dark:border-[#b500b4] bg-white dark:bg-black px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-[#21f6ff] focus:ring-2 focus:ring-[#21f6ff55] dark:focus:ring-[#21f6ff33] transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-900 dark:text-white">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border-2 border-[#ff40f3] dark:border-[#b500b4] bg-white dark:bg-black px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-[#21f6ff] focus:ring-2 focus:ring-[#21f6ff55] dark:focus:ring-[#21f6ff33] transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-[#ff40f3] to-[#21f6ff] px-4 py-3 font-semibold text-black shadow-[0_0_24px_rgba(255,64,243,0.55)] hover:shadow-[0_0_32px_rgba(33,246,255,0.5)] transition transform hover:scale-[1.02]"
              >
                Create account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="neon-link font-semibold">Log in</Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <Link href="/" className="neon-link font-semibold">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
