import React, { useState, useEffect } from 'react'
import { Sun, Moon, Landmark } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar({ onApplyClick }) {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar glass-panel ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="navbar-logo">
        <Landmark size={26} />
        <span>AeroPay</span>
      </a>

      <div className="navbar-links">
        <a href="#" className="navbar-link">Home</a>
        <a href="#calculator" className="navbar-link">Calculator</a>
        <a href="#products" className="navbar-link">Products</a>
        <a href="#how-it-works" className="navbar-link">Process</a>
        <a href="#faqs" className="navbar-link">FAQs</a>
      </div>

      <div className="navbar-actions">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={() => onApplyClick('personal')} className="glass-btn glass-btn-primary">
          Apply Now
        </button>
      </div>
    </nav>
  )
}
