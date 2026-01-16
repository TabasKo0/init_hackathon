'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

import { LiquidGlass } from '@liquidglass/react';


export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isActive = (path) => pathname === path

  return (
   
    <nav className="navbar">

    
      <div className="nav-container w-full flex justify-between items-center">
        
  <LiquidGlass
        borderRadius={100}
        blur={0.5}
        contrast={1.15}
        brightness={1.55}
        saturation={1.13}
        displacementScale={2}
        elasticity={0.5}
        className='sticky  '
      >
        <ul className="nav-menu flex space-between text-2xl p-3">
          <li>
            <a 
              href="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/info" 
              className={isActive('/info') ? 'active' : ''}
            >
              Info
            </a>
          </li>
          <li>
            <a 
              href="/updates" 
              className={isActive('/updates') ? 'active' : ''}
            >
              Updates
            </a>
          </li>
          
          {user ? (
            <li>
              <a 
                href="/account" 
                className="btn-dashboard"
              >
                Dashboard
              </a>
            </li>
          ) : (
            <li>
              <a 
                href="/login" 
                className="btn-login"
              >
                Login / Sign Up
              </a>
            </li>
          )}
        </ul>
        </LiquidGlass>
      </div>  
      
    </nav>
  )
}
