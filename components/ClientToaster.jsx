'use client'

import { Toaster } from 'react-hot-toast'

export default function ClientToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#0b0b0b',
          color: '#f8fafc',
          border: '1px solid rgba(255, 64, 243, 0.4)',
        },
      }}
    />
  )
}
