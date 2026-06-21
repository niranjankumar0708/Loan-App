// Mock API services for the loan application

export const getLoanProducts = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'personal',
      title: 'Personal Loan',
      rate: '8.5% p.a.',
      minAmount: 5000,
      maxAmount: 50000,
      image: '/images/personal_loan.png',
      features: ['No collateral needed', 'Instant cash disbursal', 'Flexible 12-60 month term'],
      schemes: [
        { name: 'Flexi Pay', rate: '8.5% p.a.', desc: 'Draw funds as needed, pay interest only on utilized amount.' },
        { name: 'Salary Advance', rate: '8.9% p.a.', desc: 'Short-term cash advance repaid automatically on next pay day.' },
        { name: 'Medical Emergency', rate: '7.9% p.a.', desc: 'Lower interest rate with 3-month repayment moratorium.' }
      ]
    },
    {
      id: 'home',
      title: 'Home Loan',
      rate: '6.8% p.a.',
      minAmount: 50000,
      maxAmount: 500000,
      image: '/images/home_loan.png',
      features: ['Lowest interest rates', 'Up to 30 year tenure', 'Zero prepayment charges'],
      schemes: [
        { name: 'PMAY Subsidy', rate: '6.5% p.a.', desc: 'Interest subsidy of up to 2.67 Lakhs for first-time home buyers.' },
        { name: 'Green Housing', rate: '6.2% p.a.', desc: 'Special discounted rates for eco-friendly, energy-efficient housing.' },
        { name: 'Joint Ownership', rate: '6.8% p.a.', desc: 'Co-applicant benefits with higher sanction limits and tax relief.' }
      ]
    },
    {
      id: 'auto',
      title: 'Auto Loan',
      rate: '7.5% p.a.',
      minAmount: 10000,
      maxAmount: 100000,
      image: '/images/auto_loan.png',
      features: ['Up to 90% funding', 'Minimal paperwork', 'Flexible repayment terms'],
      schemes: [
        { name: 'Green EV Discount', rate: '7.0% p.a.', desc: '0.5% rate discount and zero processing fees for electric vehicles.' },
        { name: 'Step-Up EMI', rate: '7.5% p.a.', desc: 'Lower EMIs in the initial years, gradually increasing as your salary grows.' },
        { name: 'Rapid Dealership', rate: '7.8% p.a.', desc: 'Instant credit checks with immediate dealership bank transfer.' }
      ]
    },
    {
      id: 'education',
      title: 'Education Loan',
      rate: '5.5% p.a.',
      minAmount: 5000,
      maxAmount: 150000,
      image: '/images/education_loan.png',
      features: ['Grace period post study', 'Covers tuition & boarding', 'Tax benefits on interest'],
      schemes: [
        { name: 'Vidya Lakshmi', rate: '5.0% p.a.', desc: 'Government-sponsored interest subsidy during the study moratorium.' },
        { name: 'Study Abroad Premium', rate: '6.0% p.a.', desc: 'Covers entire tuition fees, boarding, travel tickets, and laptop expenses.' },
        { name: 'Vocational Skill', rate: '5.5% p.a.', desc: 'Low-cost loans for certified vocational courses and skill development.' }
      ]
    }
  ]
}

export const simulateCreditScoreCheck = async (income, liabilities) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const debtRatio = liabilities / income;
  if (debtRatio > 0.6) {
    return { approved: false, score: 540, reason: 'High debt-to-income ratio' };
  }
  
  // Return simulated approved state
  return { approved: true, score: 785, rate: 8.5 };
}
