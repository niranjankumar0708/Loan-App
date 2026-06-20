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
      features: ['No collateral needed', 'Instant cash disbursal', 'Flexible 12-60 month term']
    },
    {
      id: 'home',
      title: 'Home Loan',
      rate: '6.8% p.a.',
      minAmount: 50000,
      maxAmount: 500000,
      features: ['Lowest interest rates', 'Up to 30 year tenure', 'Zero prepayment charges']
    },
    {
      id: 'auto',
      title: 'Auto Loan',
      rate: '7.5% p.a.',
      minAmount: 10000,
      maxAmount: 100000,
      features: ['Up to 90% funding', 'Minimal paperwork', 'Flexible repayment terms']
    },
    {
      id: 'education',
      title: 'Education Loan',
      rate: '5.5% p.a.',
      minAmount: 5000,
      maxAmount: 150000,
      features: ['Grace period post study', 'Covers tuition & boarding', 'Tax benefits on interest']
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
