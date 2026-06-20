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
  const [activeLoan, setActiveLoan] = useState(null)

  // Load existing loan status on mount
  useEffect(() => {
    const savedLoan = localStorage.getItem('aeropay_active_loan')
    if (savedLoan) {
      try {
        setActiveLoan(JSON.parse(savedLoan))
      } catch (e) {
        localStorage.removeItem('aeropay_active_loan')
      }
    }
  }, [])

  const openWizard = (loanType = 'personal') => {
    setPrefilledLoanType(loanType)
    setWizardOpen(true)
  }

  const closeWizard = () => {
    setWizardOpen(false)
  }

  const handleLoanApproved = (loanDetails) => {
    setActiveLoan(loanDetails)
    localStorage.setItem('aeropay_active_loan', JSON.stringify(loanDetails))
  }

  const handleClearLoan = () => {
    setActiveLoan(null)
    localStorage.removeItem('aeropay_active_loan')
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        {/* Liquid Glass Background Blobs */}
        <BlobBackground />

        {/* Floating Glass Navbar */}
        <Navbar onApplyClick={openWizard} />

        {/* Active Loan Dashboard (appears when loan is approved) */}
        {activeLoan && (
          <ActiveLoanDashboard 
            loan={activeLoan} 
            onClear={handleClearLoan} 
            onUpdate={handleLoanApproved}
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
