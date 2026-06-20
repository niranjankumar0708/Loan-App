import React, { useState, useEffect } from 'react'
import { getLoanProducts } from '../services/api'
import LoanCalculator from '../components/ui/LoanCalculator'
import TestimonialSlider from '../components/ui/TestimonialSlider'
import Accordion from '../components/ui/Accordion'
import GlassCard from '../components/ui/GlassCard'
import { 
  ShieldCheck, Zap, Calendar, User, Home, Car, GraduationCap, 
  ArrowUpRight, Check, Star, Lock, Award, HeartHandshake, Compass
} from 'lucide-react'

export default function LandingPage({ onApplyClick }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getLoanProducts().then(data => setProducts(data))
  }, [])

  // Icon mapper helper
  const getProductIcon = (id) => {
    switch (id) {
      case 'personal': return <User size={24} />
      case 'home': return <Home size={24} />
      case 'auto': return <Car size={24} />
      case 'education': return <GraduationCap size={24} />
      default: return <Compass size={24} />
    }
  }

  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <span className="glass-badge">
            <ShieldCheck size={14} style={{ color: 'var(--accent-color)' }} />
            SECURE DIGITAL CREDIT
          </span>
          <h1 className="hero-title">
            Unlock Instant <br />
            <span>Credit Releases</span> <br />
            with Liquid Glass.
          </h1>
          <p className="hero-description">
            Experience next-generation banking with AeroPay. Adjust terms dynamically, review instant schedules, and check your loan pre-approval under 2 minutes with zero paper waste.
          </p>
          <div className="hero-actions">
            <button onClick={() => onApplyClick('personal')} className="glass-btn glass-btn-primary">
              Check Pre-Approval
              <ArrowUpRight size={16} />
            </button>
            <a href="#calculator" className="glass-btn glass-btn-secondary">
              Calculate EMI
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">2 Min</span>
              <span className="stat-label">Fast Approvals</span>
            </div>
            <div className="stat-item" style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '2.5rem' }}>
              <span className="stat-number">5.5%</span>
              <span className="stat-label">Starting APR</span>
            </div>
            <div className="stat-item" style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '2.5rem' }}>
              <span className="stat-number">100%</span>
              <span className="stat-label">Paperless Portal</span>
            </div>
          </div>
        </div>

        <div className="hero-graphic">
          <GlassCard className="hero-graphic-card">
            <div className="card-header-glow">
              <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-family-title)' }}>AeroCard</span>
              <Award size={20} style={{ color: 'var(--accent-color)' }} />
            </div>
            <div className="card-chip"></div>
            <p className="card-balance-label" style={{ marginTop: '2rem' }}>Sanction Limit Approved</p>
            <h2 className="card-balance-value">$150,000</h2>
            <div className="card-footer-details">
              <div>
                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Account Owner</p>
                <p style={{ fontWeight: '600' }}>Alexander Mercer</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Valid Thru</p>
                <p style={{ fontWeight: '600' }}>06 / 31</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 2. Interactive Calculator Section */}
      <LoanCalculator onApplyClick={onApplyClick} />

      {/* 3. Loan Products Section */}
      <section id="products" className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="section-header">
          <span className="glass-badge">Custom Products</span>
          <h2 className="section-title">Loans Curated For You</h2>
          <p className="section-subtitle">
            Explore our specialized digital credit lines designed with flexible margins, low APR scales, and immediate bank dispatch.
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <GlassCard key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="product-icon">
                {getProductIcon(product.id)}
              </div>
              <h3 className="product-title">{product.title}</h3>
              <p className="product-desc">{product.description || `Optimized loan structures for your core ${product.title.toLowerCase()} goals.`}</p>
              
              <div className="product-meta">
                <span className="product-rate-lbl">Rate of Interest</span>
                <span className="product-rate-val">{product.rate}</span>
              </div>

              <ul className="product-features">
                {product.features?.map((feature, i) => (
                  <li key={i}>
                    <Check size={14} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onApplyClick(product.id)} 
                className="glass-btn glass-btn-primary"
                style={{ width: '100%', marginTop: 'auto' }}
              >
                Apply for {product.title.split(' ')[0]}
              </button>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 4. Process Timeline (How it works) */}
      <section id="how-it-works" className="section">
        <div className="section-header">
          <span className="glass-badge">Workflow</span>
          <h2 className="section-title">Four Steps To Disbursal</h2>
          <p className="section-subtitle">
            Our paperless pipeline verifies your parameters and triggers payouts in minutes. Follow this process to get funded.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <GlassCard className="timeline-card">
              <div className="timeline-num">01</div>
              <h3 className="timeline-title">Calculate Terms</h3>
              <p className="timeline-desc">Adjust the loan amount, tenure, and APR parameters to match your preferred monthly cash flows.</p>
            </GlassCard>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <GlassCard className="timeline-card">
              <div className="timeline-num">02</div>
              <h3 className="timeline-title">Submit Application</h3>
              <p className="timeline-desc">Complete our 2-step financial profile form. Our verification checks operate on 100% paperless systems.</p>
            </GlassCard>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <GlassCard className="timeline-card">
              <div className="timeline-num">03</div>
              <h3 className="timeline-title">Credit Scan</h3>
              <p className="timeline-desc">Our automated engine runs security checks and verifies your financial parameters in under a minute.</p>
            </GlassCard>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <GlassCard className="timeline-card">
              <div className="timeline-num">04</div>
              <h3 className="timeline-title">Instant Cash Release</h3>
              <p className="timeline-desc">Digitally sign the sanction letter. The funds are immediately dispatched to your verified bank account.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 5. Key Benefits Section */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="section-header">
          <span className="glass-badge">Why AeroPay</span>
          <h2 className="section-title">Engineered For Premium Credit</h2>
          <p className="section-subtitle">
            We combined bank-grade security protocols with beautiful design systems to offer a seamless visual interface.
          </p>
        </div>

        <div className="benefits-grid">
          <GlassCard className="benefit-card">
            <div className="benefit-icon-wrapper" style={{ color: 'var(--accent-color)' }}>
              <Zap size={32} />
            </div>
            <h3 className="benefit-title">Hyper Speed Payouts</h3>
            <p className="benefit-desc">Our systems run 24/7/365 to auto-disburse funds. Say goodbye to queues and lengthy approval intervals.</p>
          </GlassCard>

          <GlassCard className="benefit-card">
            <div className="benefit-icon-wrapper" style={{ color: '#ff007f' }}>
              <Lock size={32} />
            </div>
            <h3 className="benefit-title">Military Grade Encryption</h3>
            <p className="benefit-desc">Your financial profiles and connection credentials are protected under AES-256 secure network keys.</p>
          </GlassCard>

          <GlassCard className="benefit-card">
            <div className="benefit-icon-wrapper" style={{ color: '#00ff87' }}>
              <HeartHandshake size={32} />
            </div>
            <h3 className="benefit-title">Zero Prepay Levies</h3>
            <p className="benefit-desc">Pay back your loan balance early without penalties. We believe in transparent loan terms.</p>
          </GlassCard>
        </div>
      </section>

      {/* 6. Testimonials Carousel */}
      <TestimonialSlider />

      {/* 7. FAQs Section */}
      <Accordion />
    </div>
  )
}
