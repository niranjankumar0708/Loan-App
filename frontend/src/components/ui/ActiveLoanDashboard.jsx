import React, { useState, useEffect } from 'react'
import GlassCard from './GlassCard'
import { Landmark, Clock, FileText, CheckCircle2, AlertCircle, Trash2, ChevronDown, ChevronUp, CreditCard, Sparkles, ArrowUpRight } from 'lucide-react'
import { formatCurrency } from '../../utils/format'
import confetti from 'canvas-confetti'

export default function ActiveLoanDashboard({ activeLoans = [], pastLoans = [], onClear, onUpdate, onClearPast, onApplyClick }) {
  const [expandedLoans, setExpandedLoans] = useState({})

  const toggleExpanded = (reference) => {
    setExpandedLoans(prev => ({
      ...prev,
      [reference]: !prev[reference]
    }))
  }

  return (
    <div style={{ padding: '2rem 5% 0 5%', maxWidth: '1200px', width: '100%', boxSizing: 'border-box', margin: '8rem auto 0 auto', animation: 'modal-enter 0.5s ease-out' }}>
      
      {/* Active Loan Glass Cards */}
      {activeLoans && activeLoans.map((loan) => {
        const paidCount = loan?.paidCount || 0
        const totalTerms = Number(loan?.tenure) || 36
        const emiAmount = Number(loan?.emi) || 0
        const initialTotalPayable = emiAmount * totalTerms
        const outstandingBalance = loan?.outstandingBalance !== undefined ? loan.outstandingBalance : initialTotalPayable
        const isExpanded = !!expandedLoans[loan.reference]

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
          <GlassCard 
            key={loan.reference}
            style={{ 
              border: '1px solid rgba(0, 255, 135, 0.25)', 
              background: 'rgba(0, 255, 135, 0.01)',
              boxShadow: '0 8px 32px 0 rgba(0, 255, 135, 0.04)',
              padding: '1.5rem',
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
            onClick={() => toggleExpanded(loan.reference)}
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
                  onClick={() => toggleExpanded(loan.reference)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.4rem' }}
                  aria-label="Expand details"
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                <button 
                  onClick={() => onClear(loan.reference)} 
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
                <div className="dashboard-two-column">
                  {/* Left Column: Payments Section */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-family-title)' }}>
                      <CreditCard size={16} style={{ color: 'var(--accent-color)' }} />
                      Pending Repayment Summary
                    </h4>

                    <div className="dashboard-inner-two-col">
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Remaining Balance</span>
                        <p style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ff007f', marginTop: '0.1rem' }}>{formatCurrency(outstandingBalance)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>EMIs Settled</span>
                        <p style={{ fontSize: '1.4rem', fontWeight: '700', marginTop: '0.1rem' }}>{paidCount} / {totalTerms} Paid</p>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
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
        )
      })}

      {/* Repayment Ledger & Past Loans (Only render if there are past loans) */}
      {pastLoans && pastLoans.length > 0 && (
        <GlassCard 
          style={{ 
            border: '1px solid rgba(0, 242, 254, 0.25)', 
            background: 'rgba(0, 242, 254, 0.01)',
            boxShadow: '0 8px 32px 0 rgba(0, 242, 254, 0.04)',
            padding: '1.5rem',
            marginTop: activeLoans && activeLoans.length > 0 ? '2rem' : '0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-family-title)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Clock size={20} style={{ color: '#00f2fe' }} />
              Repayment Ledger & Past Loans
            </h3>
            <button 
              onClick={onClearPast} 
              style={{ background: 'transparent', border: 'none', color: '#ff007f', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.4rem 0.6rem', borderRadius: '8px' }}
              className="table-row-hover"
            >
              <Trash2 size={12} />
              Clear History
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
                  <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Reference</th>
                  <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Loan Type</th>
                  <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Principal</th>
                  <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>EMI (Rate)</th>
                  <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Tenure</th>
                  <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>Settled Date</th>
                  <th style={{ padding: '0.8rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastLoans.map((pLoan, idx) => (
                  <tr 
                    key={pLoan.reference + idx} 
                    style={{ borderBottom: idx === pastLoans.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{pLoan.reference}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{pLoan.type} Loan</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{formatCurrency(pLoan.amount)}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {formatCurrency(pLoan.emi)} <span style={{ color: 'var(--accent-color)', fontSize: '0.75rem' }}>({pLoan.rate}%)</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{pLoan.tenure} Mos</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pLoan.settledDate}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <span className="glass-badge" style={{ 
                        background: 'rgba(0, 255, 135, 0.1)', 
                        color: '#00ff87', 
                        border: '1px solid rgba(0, 255, 135, 0.2)', 
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem'
                      }}>
                        ● {pLoan.status || 'Fully Settled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Exclusive Offers & Rewards Banners */}
      <section id="offers" style={{ background: 'rgba(255,255,255,0.01)', padding: '2rem 0', marginTop: '3rem', borderTop: '1px solid var(--glass-border)', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="glass-badge" style={{ alignSelf: 'center' }}>EXCLUSIVE OFFERS</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-family-title)', color: 'var(--text-primary)', margin: 0 }}>Premium Partner Rewards</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
            Maximize your financial flexibility with our exclusive card cashbacks, high-yield compound plans, and bank integration perks.
          </p>
        </div>

        <div className="offers-grid">
          <GlassCard className="offer-card">
            <span className="glass-badge offer-tag" style={{ background: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.25)' }}>
              EXCLUSIVE CREDIT
            </span>
            <div className="offer-image-wrap">
              <img src="/images/card_ad.png" alt="AeroCard Black" className="offer-image" />
            </div>
            <h3 className="offer-title">AeroCard Black Edition</h3>
            <p className="offer-desc">
              Get up to a $5,000 credit limit with 3% cashback on all loan EMI repayments and dining. Enjoy zero annual fees for your first year.
            </p>
            <button className="glass-btn glass-btn-primary offer-action-btn" onClick={() => onApplyClick('personal')}>
              Apply for AeroCard
              <ArrowUpRight size={14} />
            </button>
          </GlassCard>

          <GlassCard className="offer-card">
            <span className="glass-badge offer-tag" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
              HIGH-YIELD WEALTH
            </span>
            <div className="offer-image-wrap">
              <img src="/images/investment_ad.png" alt="Aero APY Growth" className="offer-image" />
            </div>
            <h3 className="offer-title">AeroGold Investment Plan</h3>
            <p className="offer-desc">
              Grow your compound savings at a guaranteed 5.2% APY with daily payouts. Fully liquid withdrawals with zero locking periods.
            </p>
            <button className="glass-btn glass-btn-secondary offer-action-btn" style={{ borderColor: 'var(--accent-color)' }} onClick={() => window.location.hash = '#calculator'}>
              Calculate Yields
              <ArrowUpRight size={14} />
            </button>
          </GlassCard>

          <GlassCard className="offer-card">
            <span className="glass-badge offer-tag" style={{ background: 'rgba(0, 255, 135, 0.15)', color: '#00ff87', border: '1px solid rgba(0, 255, 135, 0.25)' }}>
              FINANCE PLATINUM
            </span>
            <div className="offer-image-wrap">
              <img src="/images/bank_connect.png" alt="Bank Link Perks" className="offer-image" />
            </div>
            <h3 className="offer-title">AeroPay Bank Link Rewards</h3>
            <p className="offer-desc">
              Securely connect your primary bank account to receive an instant 0.5% APR discount on all active loan applications.
            </p>
            <button className="glass-btn glass-btn-secondary offer-action-btn" onClick={() => onApplyClick('personal')}>
              Link Account Now
              <ArrowUpRight size={14} />
            </button>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
