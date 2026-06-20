import React from 'react'
import { Landmark, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand-column">
          <div className="navbar-logo" style={{ marginBottom: '1rem' }}>
            <Landmark size={26} />
            <span>AeroPay</span>
          </div>
          <p className="footer-description">
            AeroPay is a next-generation lending platform offering instant digital credit with minimal documentation and highly flexible repayment options.
          </p>
          <div className="footer-socials" style={{ marginTop: '1.2rem' }}>
            <a href="#" className="social-link" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" className="social-link" aria-label="GitHub"><Github size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="footer-title">Loan Products</h4>
          <ul className="footer-links">
            <li><a href="#products" className="footer-link">Personal Loans</a></li>
            <li><a href="#products" className="footer-link">Home Loans</a></li>
            <li><a href="#products" className="footer-link">Auto Loans</a></li>
            <li><a href="#products" className="footer-link">Education Loans</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Calculators</h4>
          <ul className="footer-links">
            <li><a href="#calculator" className="footer-link">EMI Calculator</a></li>
            <li><a href="#calculator" className="footer-link">Eligibility Calculator</a></li>
            <li><a href="#calculator" className="footer-link">Amortization Table</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Support</h4>
          <ul className="footer-links">
            <li className="footer-link">support@aeropay.fake</li>
            <li className="footer-link">+1 (800) 123-4567</li>
            <li><a href="#faqs" className="footer-link">Frequently Asked Questions</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AeroPay. Made with 🤍 for next-gen credit.</p>
        <div className="footer-bottom-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
