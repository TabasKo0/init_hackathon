'use client'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>🚀 Hackathon</h2>
        </div>
        <ul className="nav-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/admin">Admin</a></li>
          <li><a href="/account">Account</a></li>
        </ul>
      </div>
    </nav>
  )
}
