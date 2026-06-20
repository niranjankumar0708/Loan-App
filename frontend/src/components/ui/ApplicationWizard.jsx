import React, { useState, useEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Check, Download, Landmark, Loader } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function ApplicationWizard({ loanType = 'personal', onClose, onApproved }) {
  const [step, setStep] = useState(1) // 1: Personal, 2: Financial, 3: Verifying, 4: Approved
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    purpose: 'Debt Consolidation',
    empType: 'salaried',
    monthlyIncome: '',
    currentDebts: '0',
    requestedAmount: '25000',
    requestedTenure: '36'
  })
  
  const [creditScore, setCreditScore] = useState(300)
  const [formErrors, setFormErrors] = useState({})
  const [referenceId, setReferenceId] = useState('')

  // Trigger loading verification, then congratulations
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(4)
        // Fire confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#f02fc2', '#00ff87', '#f5d061']
        })

        const refId = `AP-${Math.floor(100000 + Math.random() * 900000)}`
        setReferenceId(refId)

        if (onApproved) {
          onApproved({
            reference: refId,
            amount: formData.requestedAmount,
            tenure: formData.requestedTenure,
            rate: calculateInterestRate(),
            emi: estimatedEMI()
          })
        }
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [step])

  // Animate credit score wheel in final step
  useEffect(() => {
    if (step === 4) {
      let current = 300
      const target = 785
      const interval = setInterval(() => {
        if (current < target) {
          current += 10
          setCreditScore(Math.min(current, target))
        } else {
          clearInterval(interval)
        }
      }, 25)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep1 = () => {
    const errors = {}
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Valid Email is required'
    if (!formData.phone.match(/^\d{10}$/)) errors.phone = '10-digit phone number is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    const errors = {}
    if (!formData.monthlyIncome || Number(formData.monthlyIncome) <= 0) {
      errors.monthlyIncome = 'Valid Monthly Income is required'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1)
  }

  const calculateInterestRate = () => {
    switch (loanType) {
      case 'home': return 6.8
      case 'auto': return 7.5
      case 'education': return 5.5
      case 'personal':
      default: return 8.5
    }
  }

  const estimatedEMI = () => {
    const P = Number(formData.requestedAmount) || 25000
    const r = calculateInterestRate() / 12 / 100
    const n = Number(formData.requestedTenure) || 36
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return Math.round(emi)
  }

  // Pre-fill amount based on defaults
  useEffect(() => {
    let amount = '25000'
    if (loanType === 'home') amount = '150000'
    if (loanType === 'auto') amount = '35000'
    if (loanType === 'education') amount = '45000'
    
    setFormData(prev => ({
      ...prev,
      requestedAmount: amount
    }))
  }, [loanType])

  return (
    <div className="modal-overlay">
      <div className="modal-card glass-panel" style={{ padding: '2.5rem' }}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
          <X size={22} />
        </button>

        {/* Step Indicator Bar */}
        {step < 3 && (
          <div className="wizard-progress-bar-container">
            <div 
              className="wizard-progress-fill" 
              style={{ width: `${step === 1 ? 50 : 100}%` }}
            ></div>
          </div>
        )}

        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <div>
            <div className="wizard-step-header">
              <span className="glass-badge" style={{ marginBottom: '0.5rem' }}>Step 1 of 2</span>
              <h3 className="wizard-step-title">Personal Profile</h3>
              <p className="wizard-step-subtitle">Tell us about yourself to begin your application for {loanType} credit.</p>
            </div>

            <div className="wizard-form-grid">
              <div className="glass-input-group">
                <label className="glass-input-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  placeholder="John Doe"
                  className="glass-input" 
                />
                {formErrors.fullName && <span style={{ color: '#ff007f', fontSize: '0.8rem' }}>{formErrors.fullName}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div className="glass-input-group">
                  <label className="glass-input-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="john@example.com"
                    className="glass-input" 
                  />
                  {formErrors.email && <span style={{ color: '#ff007f', fontSize: '0.8rem' }}>{formErrors.email}</span>}
                </div>
                <div className="glass-input-group">
                  <label className="glass-input-label">Mobile Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="1234567890"
                    className="glass-input" 
                  />
                  {formErrors.phone && <span style={{ color: '#ff007f', fontSize: '0.8rem' }}>{formErrors.phone}</span>}
                </div>
              </div>

              <div className="glass-input-group">
                <label className="glass-input-label">Purpose of Loan</label>
                <select 
                  name="purpose" 
                  value={formData.purpose} 
                  onChange={handleInputChange}
                  className="glass-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Debt Consolidation">Debt Consolidation</option>
                  <option value="Home Refurbishment">Home Refurbishment</option>
                  <option value="Education Financing">Education Financing</option>
                  <option value="Business Operations">Business Operations</option>
                  <option value="Emergency Purchase">Emergency Purchase</option>
                </select>
              </div>
            </div>

            <div className="wizard-btn-row">
              <div></div>
              <button onClick={handleNext} className="glass-btn glass-btn-primary">
                Next Step
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Financial Details */}
        {step === 2 && (
          <div>
            <div className="wizard-step-header">
              <span className="glass-badge" style={{ marginBottom: '0.5rem' }}>Step 2 of 2</span>
              <h3 className="wizard-step-title">Financial Profile</h3>
              <p className="wizard-step-subtitle">Provide details regarding your current earnings and credit size.</p>
            </div>

            <div className="wizard-form-grid">
              <div className="glass-input-group">
                <label className="glass-input-label">Employment Status</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label className="glass-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1 }}>
                    <input 
                      type="radio" 
                      name="empType" 
                      value="salaried" 
                      checked={formData.empType === 'salaried'} 
                      onChange={handleInputChange} 
                    />
                    Salaried Employee
                  </label>
                  <label className="glass-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1 }}>
                    <input 
                      type="radio" 
                      name="empType" 
                      value="selfemployed" 
                      checked={formData.empType === 'selfemployed'} 
                      onChange={handleInputChange} 
                    />
                    Self Employed
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div className="glass-input-group">
                  <label className="glass-input-label">Monthly Take-Home Income ($)</label>
                  <input 
                    type="number" 
                    name="monthlyIncome" 
                    value={formData.monthlyIncome} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 5500"
                    className="glass-input" 
                  />
                  {formErrors.monthlyIncome && <span style={{ color: '#ff007f', fontSize: '0.8rem' }}>{formErrors.monthlyIncome}</span>}
                </div>
                <div className="glass-input-group">
                  <label className="glass-input-label">Current Monthly EMIs ($)</label>
                  <input 
                    type="number" 
                    name="currentDebts" 
                    value={formData.currentDebts} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 350"
                    className="glass-input" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.2rem' }}>
                <div className="glass-input-group">
                  <label className="glass-input-label">Desired Amount ($)</label>
                  <input 
                    type="number" 
                    name="requestedAmount" 
                    value={formData.requestedAmount} 
                    onChange={handleInputChange} 
                    className="glass-input" 
                  />
                </div>
                <div className="glass-input-group">
                  <label className="glass-input-label">Tenure (Months)</label>
                  <select 
                    name="requestedTenure" 
                    value={formData.requestedTenure} 
                    onChange={handleInputChange} 
                    className="glass-input"
                  >
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                    <option value="48">48 Months</option>
                    <option value="60">60 Months</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="wizard-btn-row">
              <button onClick={handleBack} className="glass-btn glass-btn-secondary">
                <ArrowLeft size={16} />
                Back
              </button>
              <button onClick={handleNext} className="glass-btn glass-btn-primary">
                Analyze Eligibility
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verifying Loader */}
        {step === 3 && (
          <div className="simulation-loading">
            <div className="loading-ring"></div>
            <h3 className="wizard-step-title" style={{ marginTop: '1rem' }}>Verifying Credit Status</h3>
            <p className="wizard-step-subtitle" style={{ textAlign: 'center', maxWidth: '380px' }}>
              We are simulating a background credit pull (FICO check), evaluating monthly debt ratio, and calculating your optimized terms.
            </p>
          </div>
        )}

        {/* Step 4: Approved/Congratulations */}
        {step === 4 && (
          <div className="congrats-card">
            <div className="congrats-icon">
              <Check size={36} />
            </div>
            <h3 className="wizard-step-title">Eligibility Approved!</h3>
            <p className="wizard-step-subtitle" style={{ marginBottom: '1.5rem' }}>
              Congratulations {formData.fullName}! Your financial parameters qualify for instant credit release.
            </p>

            {/* Credit Score Dial */}
            <div className="credit-meter-container">
              <div 
                className="credit-meter-arc"
                style={{ transform: `rotate(${-135 + (creditScore - 300) * (270 / 550)}deg)` }}
              ></div>
            </div>
            <div className="credit-score-display">
              <div className="credit-score-num">{creditScore}</div>
              <div className="credit-score-label">FICO CREDIT SCORE: EXCELLENT</div>
            </div>

            {/* Simulated Digital Sanction Letter */}
            <div className="sanction-letter">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '0.8rem', fontWeight: '700' }}>
                <Landmark size={14} style={{ color: 'var(--accent-color)' }} />
                AeroPay Sanction Summary
              </div>
              <div className="sanction-line">
                <span>Sanction Reference:</span>
                <span style={{ color: 'var(--accent-color)' }}>{referenceId}</span>
              </div>
              <div className="sanction-line">
                <span>Sanction Amount:</span>
                <span>${Number(formData.requestedAmount).toLocaleString()}</span>
              </div>
              <div className="sanction-line">
                <span>Approved Term:</span>
                <span>{formData.requestedTenure} Months</span>
              </div>
              <div className="sanction-line">
                <span>Annual Interest Rate:</span>
                <span>{calculateInterestRate()}% p.a.</span>
              </div>
              <div className="sanction-line" style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '0.5rem', fontWeight: '600' }}>
                <span>Estimated Monthly EMI:</span>
                <span>${estimatedEMI()}</span>
              </div>
            </div>

            <div className="wizard-btn-row">
              <button 
                onClick={() => {
                  alert('Your Sanction Summary has been simulated as downloaded!')
                }} 
                className="glass-btn glass-btn-secondary"
                style={{ flex: 1 }}
              >
                <Download size={16} />
                Download Letter
              </button>
              <button onClick={onClose} className="glass-btn glass-btn-primary" style={{ flex: 1 }}>
                Dashboard Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
