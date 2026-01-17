'use client'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About</h4>
          <p>Join us for an amazing hackathon experience</p>
        </div>
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <ul>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Discord</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Hackathon. All rights reserved.</p>
      </div>
    </footer>
  )
}
