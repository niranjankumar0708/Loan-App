import React, { useState, useEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Check, Download, Landmark, Loader, ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function ApplicationWizard({ loanType = 'personal', onClose, onApproved }) {
  const [step, setStep] = useState(1) // 1: Personal, 2: Financial, 3: KYC, 4: Verifying, 5: Approved
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

  // Plaid Integration States
  const [plaidOpen, setPlaidOpen] = useState(false)
  const [plaidStep, setPlaidStep] = useState('select') // select | credentials | loading | success
  const [selectedBank, setSelectedBank] = useState('')
  const [bankVerified, setBankVerified] = useState(false)

  // Document Upload States
  const [uploadedFiles, setUploadedFiles] = useState({ idProof: null, incomeProof: null })
  const [uploading, setUploading] = useState({ idProof: false, incomeProof: false })
  const [uploadProgress, setUploadProgress] = useState({ idProof: 0, incomeProof: 0 })

  // Credit Bureau Scan Log states
  const [logs, setLogs] = useState([])

  // Trigger loading verification, then congratulations
  useEffect(() => {
    if (step === 4) {
      setLogs([])
      const logMessages = [
        "Establishing secure connection to Federal Verification gateway...",
        "Validating applicant SSN/National ID profile...",
        "Scanning uploaded Government Photo ID for OCR validation...",
        "Document match confirmed (100% confidence).",
        "Connecting to credit rating agencies (Experian, TransUnion, Equifax)...",
        "FICO credit history record parsed successfully.",
        "Analyzing debt-to-income ratio and liabilities...",
        "Calculating optimal interest rates and terms...",
        "Final checklist approved. Ready for disbursal!"
      ]
      
      let currentLogIdx = 0
      const logTimer = setInterval(() => {
        if (currentLogIdx < logMessages.length) {
          setLogs(prev => [...prev, logMessages[currentLogIdx]])
          currentLogIdx++
        } else {
          clearInterval(logTimer)
          // Wait then move to Step 5
          setTimeout(() => {
            setStep(5)
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
          }, 1000)
        }
      }, 600)
      return () => clearInterval(logTimer)
    }
  }, [step])

  // Animate credit score wheel in final step
  useEffect(() => {
    if (step === 5) {
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
    } else if (step === 3) {
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1)
  }

  const calculateInterestRate = () => {
    // If bank is verified, deduct 0.3% concession as benefit!
    const baseRate = (() => {
      switch (loanType) {
        case 'home': return 6.8
        case 'auto': return 7.5
        case 'education': return 5.5
        case 'personal':
        default: return 8.5
      }
    })()
    
    return bankVerified ? parseFloat((baseRate - 0.3).toFixed(1)) : baseRate
  }

  const estimatedEMI = () => {
    const P = Number(formData.requestedAmount) || 25000
    const r = calculateInterestRate() / 12 / 100
    const n = Number(formData.requestedTenure) || 36
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return Math.round(emi)
  }

  // File Upload Simulator
  const simulateFileUpload = (type) => {
    setUploading(prev => ({ ...prev, [type]: true }))
    setUploadProgress(prev => ({ ...prev, [type]: 10 }))
    
    let progress = 10
    const interval = setInterval(() => {
      progress += 30
      if (progress >= 100) {
        clearInterval(interval)
        setUploading(prev => ({ ...prev, [type]: false }))
        setUploadedFiles(prev => ({ 
          ...prev, 
          [type]: type === 'idProof' ? 'national_identity_card.pdf' : 'latest_paystub_verified.pdf' 
        }))
      } else {
        setUploadProgress(prev => ({ ...prev, [type]: progress }))
      }
    }, 250)
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

  const kycComplete = uploadedFiles.idProof && (bankVerified || uploadedFiles.incomeProof)

  return (
    <div className="modal-overlay">
      <div className="modal-card glass-panel" style={{ padding: '2.5rem', position: 'relative' }}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
          <X size={22} />
        </button>

        {/* Step Indicator Bar */}
        {step < 4 && (
          <div className="wizard-progress-bar-container">
            <div 
              className="wizard-progress-fill" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <div>
            <div className="wizard-step-header">
              <span className="glass-badge" style={{ marginBottom: '0.5rem' }}>Step 1 of 3</span>
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
              <span className="glass-badge" style={{ marginBottom: '0.5rem' }}>Step 2 of 3</span>
              <h3 className="wizard-step-title">Financial Profile</h3>
              <p className="wizard-step-subtitle">Provide details regarding your current earnings and credit size.</p>
            </div>

            <div className="wizard-form-grid">
              <div className="glass-input-group">
                <label className="glass-input-label">Income Verification Method</label>
                {bankVerified ? (
                  <div className="bank-verified-banner glass-panel">
                    <CheckCircle2 size={20} color="#00ff87" />
                    <div>
                      <p style={{ fontWeight: '700', color: '#00ff87' }}>{selectedBank} Connected Instantly</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Verified income details auto-populated.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setBankVerified(false)
                        setSelectedBank('')
                      }}
                      className="plaid-disconnect-btn"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setPlaidOpen(true)
                      setPlaidStep('select')
                    }}
                    className="glass-btn bank-connector-trigger-btn"
                    style={{ width: '100%', gap: '0.6rem' }}
                  >
                    <Lock size={16} color="#00f2fe" />
                    Connect Bank via Plaid (Instantly Verify Income)
                  </button>
                )}
              </div>

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
                    disabled={bankVerified}
                    style={bankVerified ? { opacity: 0.8, color: '#00ff87', fontWeight: 'bold' } : {}}
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
                Next Step
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: KYC Upload (NEW!) */}
        {step === 3 && (
          <div>
            <div className="wizard-step-header">
              <span className="glass-badge" style={{ marginBottom: '0.5rem' }}>Step 3 of 3</span>
              <h3 className="wizard-step-title">Upload Verification Documents</h3>
              <p className="wizard-step-subtitle">Please submit identity proof and financial statements to scan credentials.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div>
                <img src="/images/kyc_verification.png" alt="KYC scan" style={{ width: '100%', borderRadius: '15px', border: '1px solid var(--glass-border)' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {/* ID Proof Card */}
                <div className="upload-zone glass-panel">
                  <div className="upload-icon-label">
                    <ShieldCheck size={20} color="var(--accent-color)" />
                    <span>Government Photo ID (Passport / Drivers License)</span>
                  </div>
                  
                  {uploadedFiles.idProof ? (
                    <div className="upload-success-label">
                      <CheckCircle2 size={16} color="#00ff87" />
                      <span>{uploadedFiles.idProof}</span>
                    </div>
                  ) : uploading.idProof ? (
                    <div className="upload-progress-wrapper">
                      <div className="file-progress-bar" style={{ width: `${uploadProgress.idProof}%` }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Uploading... {uploadProgress.idProof}%</span>
                    </div>
                  ) : (
                    <button onClick={() => simulateFileUpload('idProof')} className="glass-btn upload-action-btn">
                      Attach ID File
                    </button>
                  )}
                </div>

                {/* Income Proof Card */}
                <div className="upload-zone glass-panel">
                  <div className="upload-icon-label">
                    <FileText size={20} color="#ff007f" />
                    <span>Proof of Income (Recent Paystub / Bank Statement)</span>
                  </div>
                  
                  {bankVerified ? (
                    <div className="upload-success-label" style={{ color: '#00ff87' }}>
                      <CheckCircle2 size={16} color="#00ff87" />
                      <span>Automatically Verified via Plaid connection</span>
                    </div>
                  ) : uploadedFiles.incomeProof ? (
                    <div className="upload-success-label">
                      <CheckCircle2 size={16} color="#00ff87" />
                      <span>{uploadedFiles.incomeProof}</span>
                    </div>
                  ) : uploading.incomeProof ? (
                    <div className="upload-progress-wrapper">
                      <div className="file-progress-bar" style={{ width: `${uploadProgress.incomeProof}%` }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Uploading... {uploadProgress.incomeProof}%</span>
                    </div>
                  ) : (
                    <button onClick={() => simulateFileUpload('incomeProof')} className="glass-btn upload-action-btn">
                      Attach Statement
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="wizard-btn-row">
              <button onClick={handleBack} className="glass-btn glass-btn-secondary">
                <ArrowLeft size={16} />
                Back
              </button>
              <button 
                onClick={handleNext} 
                className={`glass-btn glass-btn-primary ${!kycComplete ? 'disabled' : ''}`}
                disabled={!kycComplete}
              >
                Scan Credentials
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Scanning Loader */}
        {step === 4 && (
          <div className="simulation-loading">
            <div className="loading-ring"></div>
            <h3 className="wizard-step-title" style={{ marginTop: '1rem' }}>Verifying Credit Status</h3>
            <p className="wizard-step-subtitle" style={{ textAlign: 'center', maxWidth: '380px', marginBottom: '1.5rem' }}>
              Scanning credentials and conducting real-time risk profile analysis...
            </p>
            
            {/* Real-time scanning log console */}
            <div className="ocr-log-console">
              {logs.map((log, idx) => (
                <div key={idx} className="ocr-log-line">
                  <span className="log-arrow">&gt;</span> {log}
                </div>
              ))}
              <div className="ocr-log-cursor"></div>
            </div>
          </div>
        )}

        {/* Step 5: Approved/Congratulations */}
        {step === 5 && (
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
                <span style={{ color: '#00ff87' }}>
                  {calculateInterestRate()}% p.a. 
                  {bankVerified && <span style={{ fontSize: '0.75rem', marginLeft: '0.3rem', color: '#00f2fe' }}>(Plaid discount applied)</span>}
                </span>
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

        {/* 5. Plaid Bank Connector micro-modal */}
        {plaidOpen && (
          <div className="plaid-connector-overlay glass-panel">
            <button onClick={() => setPlaidOpen(false)} className="plaid-close-btn" aria-label="Close Plaid">
              <X size={18} />
            </button>
            <div className="plaid-header">
              <img src="/images/bank_connect.png" alt="Plaid logo" className="plaid-illustration" />
              <h3>Link Your Bank</h3>
              <p>Verify your income instantly and receive a <b>0.3% APR interest discount</b> on your loan terms.</p>
            </div>
            
            {plaidStep === 'select' && (
              <div className="plaid-body">
                <span className="plaid-label">Select Your Bank Account</span>
                <div className="plaid-bank-grid">
                  {['Chase', 'Wells Fargo', 'Bank of America', 'Citi', 'Capital One', 'US Bank'].map(bank => (
                    <button
                      key={bank}
                      className="plaid-bank-card"
                      onClick={() => {
                        setSelectedBank(bank)
                        setPlaidStep('credentials')
                      }}
                    >
                      <div className="bank-logo-placeholder">{bank[0]}</div>
                      <span>{bank}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {plaidStep === 'credentials' && (
              <div className="plaid-body">
                <span className="plaid-label">Log in to {selectedBank} Online Banking</span>
                <div className="plaid-form">
                  <input type="text" placeholder="Username / Online ID" className="glass-input" />
                  <input type="password" placeholder="Password" className="glass-input" style={{ marginTop: '0.8rem' }} />
                  <p className="plaid-disclaimer">Your login details are encrypted and never stored by AeroPay.</p>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                    <button className="glass-btn glass-btn-secondary" onClick={() => setPlaidStep('select')} style={{ flex: 1 }}>
                      Back
                    </button>
                    <button
                      className="glass-btn glass-btn-primary"
                      onClick={() => {
                        setPlaidStep('loading')
                        setTimeout(() => {
                          setPlaidStep('success')
                          setBankVerified(true)
                          setFormData(prev => ({ ...prev, monthlyIncome: '6200' }))
                          setTimeout(() => {
                            setPlaidOpen(false)
                          }, 1200)
                        }, 2000)
                      }}
                      style={{ flex: 1 }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {plaidStep === 'loading' && (
              <div className="plaid-body central-loading">
                <div className="loading-ring" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
                <p style={{ marginTop: '1rem' }}>Connecting securely to {selectedBank}...</p>
              </div>
            )}

            {plaidStep === 'success' && (
              <div className="plaid-body central-loading">
                <div className="success-checkmark">✓</div>
                <p style={{ color: '#00ff87', fontWeight: 'bold', fontSize: '1.1rem', margin: '0.8rem 0 0.2rem 0' }}>{selectedBank} linked successfully!</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly Income verified: $6,200/mo</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
