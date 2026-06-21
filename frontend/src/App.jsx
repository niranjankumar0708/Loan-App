import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import BlobBackground from './components/ui/BlobBackground'
import ApplicationWizard from './components/ui/ApplicationWizard'
import ActiveLoanDashboard from './components/ui/ActiveLoanDashboard'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [prefilledLoanType, setPrefilledLoanType] = useState('personal')
  const [activeLoans, setActiveLoans] = useState([])
  const [pastLoans, setPastLoans] = useState([])

  // Load existing loan status and history on mount
  useEffect(() => {
    // Legacy migration
    const legacyLoan = localStorage.getItem('aeropay_active_loan')
    let migratedLoans = []
    if (legacyLoan) {
      try {
        const parsedLegacy = JSON.parse(legacyLoan)
        if (parsedLegacy && parsedLegacy.reference) {
          migratedLoans.push(parsedLegacy)
        }
      } catch (e) {
        // ignore parsing error
      }
      localStorage.removeItem('aeropay_active_loan')
    }

    // Load active loans list
    const savedLoans = localStorage.getItem('aeropay_active_loans')
    let currentActive = []
    if (savedLoans) {
      try {
        currentActive = JSON.parse(savedLoans)
        if (!Array.isArray(currentActive)) {
          currentActive = []
        }
      } catch (e) {
        currentActive = []
      }
    }

    const combinedActive = [...currentActive]
    migratedLoans.forEach(mig => {
      if (!combinedActive.some(l => l.reference === mig.reference)) {
        combinedActive.push(mig)
      }
    })

    if (migratedLoans.length > 0 || !savedLoans) {
      localStorage.setItem('aeropay_active_loans', JSON.stringify(combinedActive))
    }
    setActiveLoans(combinedActive)

    // Load past loans or initialize mock history
    const savedPast = localStorage.getItem('aeropay_past_loans')
    if (savedPast) {
      try {
        setPastLoans(JSON.parse(savedPast))
      } catch (e) {
        setPastLoans([])
      }
    } else {
      const initialMock = [
        {
          reference: 'AP-84920',
          type: 'personal',
          title: 'Personal Flex Credit',
          amount: 10000,
          rate: 6.5,
          tenure: 24,
          emi: 445.47,
          settledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: 'Fully Settled'
        },
        {
          reference: 'AP-37492',
          type: 'auto',
          title: 'Drive-Green Auto Loan',
          amount: 32000,
          rate: 5.8,
          tenure: 48,
          emi: 748.24,
          settledDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: 'Fully Settled'
        }
      ]
      localStorage.setItem('aeropay_past_loans', JSON.stringify(initialMock))
      setPastLoans(initialMock)
    }
  }, [])

  const openWizard = (loanType = 'personal') => {
    setPrefilledLoanType(loanType)
    setWizardOpen(true)
  }

  const closeWizard = () => {
    setWizardOpen(false)
  }

  const archiveLoan = (loanDetails) => {
    setPastLoans(prevPast => {
      if (prevPast.some(l => l.reference === loanDetails.reference)) {
        return prevPast
      }
      const newPast = [
        {
          reference: loanDetails.reference,
          type: loanDetails.type || 'personal',
          title: (loanDetails.type ? loanDetails.type.charAt(0).toUpperCase() + loanDetails.type.slice(1) : 'Personal') + ' Loan',
          amount: loanDetails.amount,
          rate: loanDetails.rate,
          tenure: loanDetails.tenure,
          emi: loanDetails.emi,
          settledDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: 'Fully Settled'
        },
        ...prevPast
      ]
      localStorage.setItem('aeropay_past_loans', JSON.stringify(newPast))
      return newPast
    })
  }

  const handleLoanApproved = (loanDetails) => {
    setActiveLoans(prevLoans => {
      let updatedLoans;
      if (prevLoans.some(l => l.reference === loanDetails.reference)) {
        updatedLoans = prevLoans.map(l => l.reference === loanDetails.reference ? loanDetails : l)
      } else {
        updatedLoans = [...prevLoans, loanDetails]
      }
      localStorage.setItem('aeropay_active_loans', JSON.stringify(updatedLoans))
      return updatedLoans
    })

    // Archive if paid off
    const totalTerms = Number(loanDetails.tenure) || 36
    const paidCount = loanDetails.paidCount || 0
    if (paidCount >= totalTerms) {
      archiveLoan(loanDetails)
    }
  }

  const handleClearLoan = (reference) => {
    setActiveLoans(prevLoans => {
      const updatedLoans = prevLoans.filter(l => l.reference !== reference)
      localStorage.setItem('aeropay_active_loans', JSON.stringify(updatedLoans))
      return updatedLoans
    })
  }

  const handleClearPastLoans = () => {
    localStorage.removeItem('aeropay_past_loans')
    setPastLoans([])
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        {/* Liquid Glass Background Blobs */}
        <BlobBackground />

        {/* Floating Glass Navbar */}
        <Navbar onApplyClick={openWizard} />

        {/* Active Loan Dashboard (appears when loan is approved or history exists) */}
        {(activeLoans.length > 0 || pastLoans.length > 0) && (
          <ActiveLoanDashboard 
            activeLoans={activeLoans} 
            pastLoans={pastLoans}
            onClear={handleClearLoan} 
            onUpdate={handleLoanApproved}
            onClearPast={handleClearPastLoans}
            onApplyClick={openWizard}
          />
        )}

        {/* Main Content */}
        <main>
          <LandingPage onApplyClick={openWizard} />
        </main>

        {/* Glass Footer */}
        <Footer />

        {/* Multi-step Application Wizard Modal */}
        {wizardOpen && (
          <ApplicationWizard 
            loanType={prefilledLoanType} 
            onClose={closeWizard} 
            onApproved={handleLoanApproved}
          />
        )}
      </div>
    </ThemeProvider>
  )
}
