import React, { useState, useMemo } from 'react'
import GlassCard from './GlassCard'
import { Calendar, DollarSign, Percent, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency } from '../../utils/format'

export default function LoanCalculator({ onApplyClick }) {
  const [loanAmount, setLoanAmount] = useState(25000)
  const [tenure, setTenure] = useState(36) // in months
  const [interestRate, setInterestRate] = useState(8.5)
  const [showSchedule, setShowSchedule] = useState(false)

  // Calculate Loan Details
  const calculations = useMemo(() => {
    const principal = Number(loanAmount)
    const monthlyRate = Number(interestRate) / 12 / 100
    const months = Number(tenure)

    let emi = 0
    if (monthlyRate === 0) {
      emi = principal / months
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    }

    const totalPayable = emi * months
    const totalInterest = totalPayable - principal
    
    // SVG Donut metrics
    const circumference = 2 * Math.PI * 50 // r = 50, C = 314.159
    const principalRatio = principal / totalPayable
    const interestRatio = totalInterest / totalPayable
    const principalStroke = principalRatio * circumference
    const interestStroke = interestRatio * circumference

    return {
      emi: Math.round(emi),
      totalPayable: Math.round(totalPayable),
      totalInterest: Math.round(totalInterest),
      principalStroke,
      interestStroke,
      circumference
    }
  }, [loanAmount, tenure, interestRate])

  // Generate Amortization Schedule Preview
  const schedulePreview = useMemo(() => {
    const list = []
    const principal = Number(loanAmount)
    const monthlyRate = Number(interestRate) / 12 / 100
    let balance = principal
    const emi = calculations.emi

    // Generate up to 6 months preview
    const previewMonths = Math.min(6, tenure)
    for (let i = 1; i <= previewMonths; i++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = emi - interestPayment
      balance = Math.max(0, balance - principalPayment)

      list.push({
        month: i,
        emi: emi,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(balance)
      })
    }
    return list
  }, [loanAmount, tenure, interestRate, calculations.emi])

  return (
    <section id="calculator" className="section">
      <div className="section-header">
        <span className="glass-badge">EMI Calculator</span>
        <h2 className="section-title">Calculate Your Monthly Installment</h2>
        <p className="section-subtitle">
          Adjust the sliders to estimate your monthly loan payments, interest structure, and visual amortization details instantly.
        </p>
      </div>

      <div className="calculator-grid">
        {/* Sliders Panel */}
        <GlassCard className="calc-inputs">
          {/* Slider 1: Loan Amount */}
          <div className="glass-input-group">
            <div className="slider-group-header">
              <span className="slider-title">Loan Amount</span>
              <div className="slider-val-box">
                {formatCurrency(loanAmount)}
              </div>
            </div>
            <input 
              type="range" 
              min="5000" 
              max="200000" 
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="glass-range-slider"
              id="calc-amount-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>{formatCurrency(5000)}</span>
              <span>{formatCurrency(200000)}</span>
            </div>
          </div>

          {/* Slider 2: Interest Rate */}
          <div className="glass-input-group">
            <div className="slider-group-header">
              <span className="slider-title">Interest Rate</span>
              <div className="slider-val-box">
                {interestRate}% p.a.
              </div>
            </div>
            <input 
              type="range" 
              min="5" 
              max="20" 
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="glass-range-slider"
              id="calc-rate-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Slider 3: Loan Tenure */}
          <div className="glass-input-group">
            <div className="slider-group-header">
              <span className="slider-title">Tenure (Months)</span>
              <div className="slider-val-box">
                {tenure} Months
              </div>
            </div>
            <input 
              type="range" 
              min="12" 
              max="60" 
              step="6"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="glass-range-slider"
              id="calc-tenure-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>12 Months</span>
              <span>60 Months</span>
            </div>
          </div>

          {/* Value indicators */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="glass-input-group">
              <span className="glass-input-label">Direct Amount Input</span>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="number"
                  min="5000"
                  max="200000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.min(200000, Math.max(0, Number(e.target.value))))}
                  className="glass-input"
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
            <div className="glass-input-group">
              <span className="glass-input-label">Direct Interest Input</span>
              <div style={{ position: 'relative' }}>
                <Percent size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="number"
                  min="5"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.min(20, Math.max(0, Number(e.target.value))))}
                  className="glass-input"
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Results Panel with Donut Chart */}
        <GlassCard className="calc-results-card">
          <div className="calc-chart-container">
            <svg width="220" height="220" viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="50" className="donut-hole" />
              <circle cx="60" cy="60" r="50" className="donut-ring" />
              
              {/* Principal Segment */}
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                className="donut-segment-principal" 
                strokeDasharray={`${calculations.principalStroke} ${calculations.circumference}`}
                strokeDashoffset="0"
              />

              {/* Interest Segment */}
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                className="donut-segment-interest" 
                strokeDasharray={`${calculations.interestStroke} ${calculations.circumference}`}
                strokeDashoffset={`-${calculations.principalStroke}`}
              />
            </svg>

            <div className="chart-center-text">
              <span className="chart-center-lbl">Total Split</span>
              <span className="chart-center-num">
                ${Math.round(loanAmount / calculations.totalPayable * 100)}%
              </span>
              <span className="chart-center-lbl" style={{ fontSize: '0.65rem' }}>Principal</span>
            </div>
          </div>

          <div className="calc-emi-box">
            <p className="emi-label">Estimated Monthly Payment</p>
            <h3 className="emi-amount">{formatCurrency(calculations.emi)}</h3>
          </div>

          <div className="breakdown-legend">
            <div className="legend-item">
              <div className="legend-label-wrap">
                <span className="legend-color-dot dot-principal"></span>
                <span>Principal Amount</span>
              </div>
              <span className="legend-val">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="legend-item">
              <div className="legend-label-wrap">
                <span className="legend-color-dot dot-interest"></span>
                <span>Total Interest</span>
              </div>
              <span className="legend-val" style={{ color: '#ff007f' }}>
                {formatCurrency(calculations.totalInterest)}
              </span>
            </div>
            <div className="legend-item" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.8rem', fontWeight: '700' }}>
              <span>Total Payable</span>
              <span>{formatCurrency(calculations.totalPayable)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
            <button 
              onClick={() => setShowSchedule(!showSchedule)} 
              className="glass-btn glass-btn-secondary"
              style={{ flex: 1 }}
            >
              {showSchedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Schedule
            </button>
            <button 
              onClick={() => onApplyClick('personal')} 
              className="glass-btn glass-btn-primary"
              style={{ flex: 2 }}
            >
              Apply This Loan
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Dynamic Schedule Table */}
      {showSchedule && (
        <div style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', animation: 'modal-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <GlassCard style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', fontFamily: 'var(--font-family-title)' }}>
              Amortization Schedule (First 6 Months Preview)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>Month</th>
                    <th style={{ padding: '0.8rem 1rem' }}>EMI</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Principal Paid</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Interest Paid</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedulePreview.map((row) => (
                    <tr key={row.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background-color 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '0.8rem 1rem', fontWeight: '600' }}>Month {row.month}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{formatCurrency(row.emi)}</td>
                      <td style={{ padding: '0.8rem 1rem', color: 'var(--accent-color)' }}>{formatCurrency(row.principal)}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#ff007f' }}>{formatCurrency(row.interest)}</td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: '600' }}>{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', fontStyle: 'italic' }}>
              *This table shows an estimation based on a flat interest calculation. Actual bank rates and compounding profiles may differ.
            </p>
          </GlassCard>
        </div>
      )}
    </section>
  )
}
