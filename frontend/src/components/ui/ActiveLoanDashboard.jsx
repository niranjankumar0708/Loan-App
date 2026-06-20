import React, { useState, useEffect } from 'react'
import GlassCard from './GlassCard'
import { Landmark, Clock, FileText, CheckCircle2, AlertCircle, Trash2, ChevronDown, ChevronUp, CreditCard, Sparkles } from 'lucide-react'
import { formatCurrency } from '../../utils/format'
import confetti from 'canvas-confetti'

export default function ActiveLoanDashboard({ loan, onClear, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!loan) return null

  // Defaults if not already set on the loan object
  const paidCount = loan.paidCount || 0
  const totalTerms = Number(loan.tenure) || 36
  const emiAmount = Number(loan.emi) || 0
  const initialTotalPayable = emiAmount * totalTerms
  const outstandingBalance = loan.outstandingBalance !== undefined ? loan.outstandingBalance : initialTotalPayable

  // Calculate Next Due Date (simulated: exactly 1 month + paidCount months from today)
  const getNextDueDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1 + paidCount)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const handlePayEMI = (e) => {
    e.stopPropagation() // Prevent collapsing when clicking button
    
    if (paidCount >= totalTerms) {
      alert("This loan is fully repaid! Congratulations!")
      return
    }

    const nextPaidCount = paidCount + 1
    const nextOutstanding = Math.max(0, outstandingBalance - emiAmount)

    const updated = {
      ...loan,
      paidCount: nextPaidCount,
      outstandingBalance: nextOutstanding
    }

    // Trigger update
    onUpdate(updated)

    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00ff87', '#00f2fe', '#f5d061']
    })
  }

  return (
    <div style={{ padding: '2rem 5% 0 5%', maxWidth: '1200px', margin: '8rem auto 0 auto', animation: 'modal-enter 0.5s ease-out' }}>
      <GlassCard 
        style={{ 
          border: '1px solid rgba(0, 255, 135, 0.25)', 
          background: 'rgba(0, 255, 135, 0.01)',
          boxShadow: '0 8px 32px 0 rgba(0, 255, 135, 0.04)',
          padding: '1.5rem',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Collapsed Header / Status Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(0, 255, 135, 0.1)', 
              color: '#00ff87', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Landmark size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--font-family-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Active Loan Portal
                {paidCount >= totalTerms ? (
                  <span className="glass-badge" style={{ 
                    background: 'rgba(255, 0, 127, 0.1)', 
                    color: '#ff007f', 
                    border: '1px solid rgba(255, 0, 127, 0.2)', 
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem'
                  }}>
                    ● fully repaid
                  </span>
                ) : paidCount > 0 ? (
                  <span className="glass-badge" style={{ 
                    background: 'rgba(0, 242, 254, 0.1)', 
                    color: '#00f2fe', 
                    border: '1px solid rgba(0, 242, 254, 0.2)', 
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem'
                  }}>
                    ● active / repaying
                  </span>
                ) : (
                  <span className="glass-badge" style={{ 
                    background: 'rgba(0, 255, 135, 0.1)', 
                    color: '#00ff87', 
                    border: '1px solid rgba(0, 255, 135, 0.2)', 
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem'
                  }}>
                    ● pending disbursal
                  </span>
                )}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Ref: {loan.reference} • Principal: {formatCurrency(Number(loan.amount))} • Term: {loan.tenure} Months
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={(e) => e.stopPropagation()}>
            {/* Show Quick Repayment status */}
            <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Outstanding: </span>
              <span style={{ fontWeight: '700', color: '#ff007f' }}>{formatCurrency(outstandingBalance)}</span>
            </div>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.4rem' }}
              aria-label="Expand details"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            <button 
              onClick={onClear} 
              style={{ background: 'transparent', border: 'none', color: '#ff007f', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.4rem 0.6rem', borderRadius: '8px' }}
              className="table-row-hover"
            >
              <Trash2 size={12} />
              Reset
            </button>
          </div>
        </div>

        {/* Expanded Details Body */}
        {isExpanded && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', animation: 'modal-enter 0.4s ease-out' }}>
            {/* Loan Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sanctioned Principal</span>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '0.2rem', color: 'var(--text-primary)' }}>{formatCurrency(Number(loan.amount))}</h4>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Installment (EMI)</span>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '0.2rem', color: 'var(--accent-color)' }}>{formatCurrency(emiAmount)}</h4>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rate of Interest</span>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '0.2rem', color: 'var(--text-primary)' }}>{loan.rate}% p.a.</h4>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Term Length</span>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '0.2rem', color: 'var(--text-primary)' }}>{totalTerms} Months</h4>
              </div>
            </div>

            {/* Payments & Disbursal details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Left Column: Payments Section */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-family-title)' }}>
                  <CreditCard size={16} style={{ color: 'var(--accent-color)' }} />
                  Pending Repayment Summary
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Remaining Balance</span>
                    <p style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ff007f', marginTop: '0.1rem' }}>{formatCurrency(outstandingBalance)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>EMIs Settled</span>
                    <p style={{ fontSize: '1.4rem', fontWeight: '700', marginTop: '0.1rem' }}>{paidCount} / {totalTerms} Paid</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifycontent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Next EMI Installment Due</span>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{getNextDueDate()}</p>
                  </div>

                  <button 
                    onClick={handlePayEMI}
                    disabled={paidCount >= totalTerms}
                    className="glass-btn glass-btn-primary"
                    style={{ 
                      padding: '0.6rem 1.2rem', 
                      fontSize: '0.85rem', 
                      background: paidCount >= totalTerms ? 'rgba(255,255,255,0.05)' : 'var(--primary-gradient)',
                      cursor: paidCount >= totalTerms ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Sparkles size={14} />
                    Pay EMI ({formatCurrency(emiAmount)})
                  </button>
                </div>
              </div>

              {/* Right Column: Disbursal Tracker */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-family-title)' }}>
                  <FileText size={16} style={{ color: 'var(--accent-color)' }} />
                  Disbursal Progress
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#00ff87', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>1. Credit FICO Verified</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#00ff87', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>2. Terms E-Signed</span>
                  </div>

                  {paidCount === 0 ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--accent-color)', borderTopColor: 'transparent', animation: 'spin 1s infinite linear', flexShrink: 0 }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-color)' }}>3. Disbursal Outward Bank Transfer</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <AlertCircle size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>4. Funded (Money in Bank)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <CheckCircle2 size={16} style={{ color: '#00ff87', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>3. Disbursal Outward Bank Transfer</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <CheckCircle2 size={16} style={{ color: '#00ff87', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>4. Funded (Money in Bank)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
