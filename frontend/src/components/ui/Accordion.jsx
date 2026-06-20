import React, { useState } from 'react'
import GlassCard from './GlassCard'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    id: 1,
    question: 'What are the core eligibility criteria for an AeroPay loan?',
    answer: 'To qualify for an AeroPay loan, you must be at least 21 years old, have a stable monthly source of income (salaried or self-employed), and possess a credit score of 600 or higher. Higher credit scores automatically unlock lower interest rates.'
  },
  {
    id: 2,
    question: 'What documents do I need to provide for the application?',
    answer: 'AeroPay is a 100% paperless digital lending platform. You only need to verify your identity (SSN/PAN/National ID) and connect your bank account securely to verify income. No physical papers or branch visits are required.'
  },
  {
    id: 3,
    question: 'How long does it take for my loan to be approved and disbursed?',
    answer: 'Initial credit pre-approval takes under 2 minutes through our Application Wizard. Once you confirm the terms and execute the digital agreement, funds are typically dispatched to your verified bank account in 2 to 24 hours.'
  },
  {
    id: 4,
    question: 'Are there any hidden fees or early prepayment penalties?',
    answer: 'No hidden charges. We charge a small processing fee (1.5% - 2.5% depending on loan size) which is clearly disclosed upfront. Foreclosure or early prepayments are completely free, with zero penalty charges.'
  },
  {
    id: 5,
    question: 'Can I choose my own monthly repayment schedule?',
    answer: 'Yes! Our dynamic calculator allows you to adjust the repayment term from 12 months up to 60 months. This helps you select a monthly payment that comfortably fits your budget.'
  }
]

export default function Accordion() {
  const [openId, setOpenId] = useState(null)

  const toggleFAQ = (id) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <section id="faqs" className="section">
      <div className="section-header">
        <span className="glass-badge">FAQs</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">
          Have questions about the loan limits, interest rates, or eligibility requirements? Find answers below.
        </p>
      </div>

      <div className="faq-container">
        {FAQS.map(faq => {
          const isOpen = openId === faq.id
          return (
            <GlassCard 
              key={faq.id} 
              className="faq-item" 
              style={{ padding: '0' }}
              onClick={() => toggleFAQ(faq.id)}
            >
              <div className="faq-header">
                <span className="faq-question">{faq.question}</span>
                <ChevronDown 
                  size={18} 
                  className={`faq-arrow ${isOpen ? 'open' : ''}`}
                />
              </div>
              <div 
                className="faq-body-wrapper"
                style={{ maxHeight: isOpen ? '200px' : '0px' }}
              >
                <div className="faq-body">
                  {faq.answer}
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
