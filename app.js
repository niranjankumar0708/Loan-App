// AeroPay Static Driver Application Code

/* ==========================================================================
   Dataset declarations
   ========================================================================== */
const PRODUCTS = [
  {
    id: 'personal',
    title: 'Personal Loan',
    rate: '8.5% p.a.',
    minAmount: 5000,
    maxAmount: 50000,
    features: ['No collateral needed', 'Instant cash disbursal', 'Flexible 12-60 month term'],
    icon: 'user'
  },
  {
    id: 'home',
    title: 'Home Loan',
    rate: '6.8% p.a.',
    minAmount: 50000,
    maxAmount: 500000,
    features: ['Lowest interest rates', 'Up to 30 year tenure', 'Zero prepayment charges'],
    icon: 'home'
  },
  {
    id: 'auto',
    title: 'Auto Loan',
    rate: '7.5% p.a.',
    minAmount: 10000,
    maxAmount: 100000,
    features: ['Up to 90% funding', 'Minimal paperwork', 'Flexible repayment terms'],
    icon: 'car'
  },
  {
    id: 'education',
    title: 'Education Loan',
    rate: '5.5% p.a.',
    minAmount: 5000,
    maxAmount: 150000,
    features: ['Grace period post study', 'Covers tuition & boarding', 'Tax benefits on interest'],
    icon: 'graduation-cap'
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Home Owner & Architect',
    rating: 5,
    text: 'AeroPay made financing my office remodel incredibly easy. The slider calculations matched the actual terms exactly, and the verification modal took less than 2 minutes. Plus, the glass UI is beautiful!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 2,
    name: 'Marcus Thorne',
    role: 'Founder, CloudScale',
    rating: 5,
    text: 'Usually, business credit applications feel clunky and slow. AeroPay is a breath of fresh air. I checked my rate terms, simulated the application, and was approved instantly. Absolute game changer.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Medical Graduate',
    rating: 5,
    text: 'Highly interactive and easy to use on my phone. Checking eligibility was quick and transparent, and the custom loan schedules allowed me to plan my monthly payments without any hidden catches.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120'
  }
];

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
];

/* ==========================================================================
   Helper Formatting Utilities
   ========================================================================== */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

/* ==========================================================================
   Interactive Glow & Scroll Listeners
   ========================================================================== */
function initializeSpotlightCards() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });
}

// Navbar Scroll highlights
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('main-navbar');
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ==========================================================================
   EMI Calculator Core Logic
   ========================================================================== */
const amountSlider = document.getElementById('amount-slider');
const rateSlider = document.getElementById('rate-slider');
const tenureSlider = document.getElementById('tenure-slider');

const amountInput = document.getElementById('amount-input');
const rateInput = document.getElementById('rate-input');

const amountVal = document.getElementById('amount-val');
const rateVal = document.getElementById('rate-val');
const tenureVal = document.getElementById('tenure-val');

const emiDisplay = document.getElementById('emi-display');
const splitPercentage = document.getElementById('split-percentage');
const legendPrincipal = document.getElementById('legend-principal-val');
const legendInterest = document.getElementById('legend-interest-val');
const legendTotal = document.getElementById('legend-total-val');

const donutPrincipal = document.getElementById('donut-principal');
const donutInterest = document.getElementById('donut-interest');

const toggleScheduleBtn = document.getElementById('toggle-schedule-btn');
const scheduleBtnIcon = document.getElementById('schedule-btn-icon');
const scheduleWrapper = document.getElementById('schedule-wrapper');
const scheduleTableBody = document.getElementById('schedule-table-body');

let showSchedule = false;

function calculateEMI() {
  const principal = Number(amountSlider.value);
  const annualRate = Number(rateSlider.value);
  const monthlyRate = annualRate / 12 / 100;
  const months = Number(tenureSlider.value);

  // Sync label text
  amountVal.innerText = formatCurrency(principal);
  rateVal.innerText = `${annualRate}% p.a.`;
  tenureVal.innerText = `${months} Months`;

  // Sync inputs
  amountInput.value = principal;
  rateInput.value = annualRate;

  let emi = 0;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const roundedEmi = Math.round(emi);
  const totalPayable = roundedEmi * months;
  const totalInterest = totalPayable - principal;

  // Donut metrics (circumference = 314)
  const principalRatio = principal / totalPayable;
  const interestRatio = totalInterest / totalPayable;
  const C = 314.159;

  const principalStroke = principalRatio * C;
  const interestStroke = interestRatio * C;

  donutPrincipal.setAttribute('stroke-dasharray', `${principalStroke} ${C}`);
  donutInterest.setAttribute('stroke-dasharray', `${interestStroke} ${C}`);
  donutInterest.setAttribute('stroke-dashoffset', `-${principalStroke}`);

  // Update displays
  splitPercentage.innerText = `${Math.round(principalRatio * 100)}%`;
  emiDisplay.innerText = formatCurrency(roundedEmi);
  legendPrincipal.innerText = formatCurrency(principal);
  legendInterest.innerText = formatCurrency(totalInterest);
  legendTotal.innerText = formatCurrency(totalPayable);

  updateAmortizationSchedule(principal, monthlyRate, months, roundedEmi);
}

function updateAmortizationSchedule(principal, monthlyRate, months, emi) {
  let balance = principal;
  let html = '';
  
  const previewMonths = Math.min(6, months);
  for (let i = 1; i <= previewMonths; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = emi - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    html += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.03); transition: background-color 0.2s;" class="table-row-hover">
        <td style="padding: 0.8rem 1rem; font-weight: 600;">Month ${i}</td>
        <td style="padding: 0.8rem 1rem;">${formatCurrency(emi)}</td>
        <td style="padding: 0.8rem 1rem; color: var(--accent-color);">${formatCurrency(Math.round(principalPayment))}</td>
        <td style="padding: 0.8rem 1rem; color: #ff007f;">${formatCurrency(Math.round(interestPayment))}</td>
        <td style="padding: 0.8rem 1rem; font-weight: 600;">${formatCurrency(Math.round(balance))}</td>
      </tr>
    `;
  }
  scheduleTableBody.innerHTML = html;
}

// Bind Calculator Slider events
[amountSlider, rateSlider, tenureSlider].forEach(slider => {
  slider.addEventListener('input', calculateEMI);
});

// Bind Direct Input events
amountInput.addEventListener('change', () => {
  amountSlider.value = Math.min(200000, Math.max(5000, Number(amountInput.value)));
  calculateEMI();
});
rateInput.addEventListener('change', () => {
  rateSlider.value = Math.min(20, Math.max(5, Number(rateInput.value)));
  calculateEMI();
});

// Bind schedule toggles
toggleScheduleBtn.addEventListener('click', () => {
  showSchedule = !showSchedule;
  if (showSchedule) {
    scheduleWrapper.style.display = 'block';
    scheduleBtnIcon.style.transform = 'rotate(180deg)';
  } else {
    scheduleWrapper.style.display = 'none';
    scheduleBtnIcon.style.transform = 'rotate(0deg)';
  }
});

/* ==========================================================================
   Load Loan Products Cards
   ========================================================================== */
function loadProducts() {
  const container = document.getElementById('products-grid-container');
  let html = '';
  
  PRODUCTS.forEach(p => {
    let featuresHtml = '';
    p.features.forEach(f => {
      featuresHtml += `<li><i data-lucide="check" style="width: 14px; height: 14px;"></i>${f}</li>`;
    });

    html += `
      <div class="glass-card product-card" style="display: flex; flex-direction: column;">
        <div class="product-icon">
          <i data-lucide="${p.icon}"></i>
        </div>
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">Optimized loan structures for your core ${p.title.toLowerCase()} goals.</p>
        
        <div class="product-meta">
          <span class="product-rate-lbl">Rate of Interest</span>
          <span class="product-rate-val">${p.rate}</span>
        </div>

        <ul class="product-features">
          ${featuresHtml}
        </ul>

        <button class="glass-btn glass-btn-primary apply-trigger" data-loan="${p.id}" style="width: 100%; margin-top: auto;">
          Apply for ${p.title.split(' ')[0]}
        </button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

/* ==========================================================================
   Load Testimonials Carousel
   ========================================================================== */
let activeTestiIndex = 0;

function loadTestimonial() {
  const current = TESTIMONIALS[activeTestiIndex];
  
  document.getElementById('testimonial-quote').innerText = `"${current.text}"`;
  document.getElementById('testimonial-img').src = current.avatar;
  document.getElementById('testimonial-img').alt = current.name;
  document.getElementById('testimonial-user-name').innerText = current.name;
  document.getElementById('testimonial-user-role').innerText = current.role;

  // Render Stars
  let starsHtml = '';
  for (let i = 0; i < current.rating; i++) {
    starsHtml += '<i data-lucide="star" style="width: 15px; height: 15px; fill: currentColor; stroke: none;"></i>';
  }
  document.getElementById('testimonial-stars').innerHTML = starsHtml;

  // Render Dots
  let dotsHtml = '';
  TESTIMONIALS.forEach((_, idx) => {
    dotsHtml += `<div class="slider-dot ${idx === activeTestiIndex ? 'active' : ''}" onclick="gotoTestimonial(${idx})"></div>`;
  });
  document.getElementById('testi-dots-container').innerHTML = dotsHtml;
  
  // Re-create icons for stars/quotes
  lucide.createIcons();
}

window.gotoTestimonial = function(idx) {
  activeTestiIndex = idx;
  loadTestimonial();
};

document.getElementById('testi-prev-btn').addEventListener('click', () => {
  activeTestiIndex = activeTestiIndex === 0 ? TESTIMONIALS.length - 1 : activeTestiIndex - 1;
  loadTestimonial();
});

document.getElementById('testi-next-btn').addEventListener('click', () => {
  activeTestiIndex = activeTestiIndex === TESTIMONIALS.length - 1 ? 0 : activeTestiIndex + 1;
  loadTestimonial();
});

/* ==========================================================================
   Load FAQ Accordions
   ========================================================================== */
let openFAQId = null;

function loadFAQs() {
  const container = document.getElementById('faq-accordions-container');
  let html = '';
  
  FAQS.forEach(faq => {
    html += `
      <div class="glass-card faq-item" style="padding: 0;" onclick="toggleFAQ(${faq.id})">
        <div class="faq-header">
          <span class="faq-question">${faq.question}</span>
          <i data-lucide="chevron-down" class="faq-arrow" id="faq-arrow-${faq.id}" style="width: 18px; height: 18px;"></i>
        </div>
        <div class="faq-body-wrapper" id="faq-body-${faq.id}">
          <div class="faq-body">
            ${faq.answer}
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.toggleFAQ = function(id) {
  const body = document.getElementById(`faq-body-${id}`);
  const arrow = document.getElementById(`faq-arrow-${id}`);
  
  const isCurrentlyOpen = openFAQId === id;
  
  // Close existing open one
  if (openFAQId !== null) {
    document.getElementById(`faq-body-${openFAQId}`).style.maxHeight = '0px';
    document.getElementById(`faq-arrow-${openFAQId}`).classList.remove('open');
  }

  if (!isCurrentlyOpen) {
    body.style.maxHeight = '200px';
    arrow.classList.add('open');
    openFAQId = id;
  } else {
    openFAQId = null;
  }
};

/* ==========================================================================
   Application Wizard Modal Code
   ========================================================================== */
const wizardModal = document.getElementById('wizard-modal');
const closeWizBtn = document.getElementById('close-modal-btn');
const wizProgressFill = document.getElementById('wizard-progress-fill');

const step1 = document.getElementById('wizard-step-1');
const step2 = document.getElementById('wizard-step-2');
const step3 = document.getElementById('wizard-step-3');
const step4 = document.getElementById('wizard-step-4');

let currentWizardStep = 1;
let currentLoanType = 'personal';

// Form Fields
const wizFullName = document.getElementById('wiz-fullname');
const wizEmail = document.getElementById('wiz-email');
const wizPhone = document.getElementById('wiz-phone');
const wizPurpose = document.getElementById('wiz-purpose');
const wizIncome = document.getElementById('wiz-income');
const wizDebts = document.getElementById('wiz-debts');
const wizAmount = document.getElementById('wiz-amount');
const wizTenure = document.getElementById('wiz-tenure');

// Errors
const errFullName = document.getElementById('error-fullname');
const errEmail = document.getElementById('error-email');
const errPhone = document.getElementById('error-phone');
const errIncome = document.getElementById('error-income');

function openWizard(loanType = 'personal') {
  currentLoanType = loanType;
  currentWizardStep = 1;
  
  // Set defaults based on product type
  let amount = 25000;
  if (loanType === 'home') amount = 150000;
  if (loanType === 'auto') amount = 35000;
  if (loanType === 'education') amount = 45000;

  wizAmount.value = amount;
  
  // Display Step 1
  step1.style.display = 'block';
  step2.style.display = 'none';
  step3.style.display = 'none';
  step4.style.display = 'none';
  
  wizProgressFill.style.width = '50%';
  document.getElementById('wizard-progress-container').style.display = 'block';
  
  wizardModal.style.display = 'flex';
  
  // Clear Errors
  [errFullName, errEmail, errPhone, errIncome].forEach(err => err.style.display = 'none');
}

function closeWizard() {
  wizardModal.style.display = 'none';
}

function getLoanRate() {
  switch (currentLoanType) {
    case 'home': return 6.8;
    case 'auto': return 7.5;
    case 'education': return 5.5;
    case 'personal':
    default: return 8.5;
  }
}

function validateStep1() {
  let valid = true;
  errFullName.style.display = 'none';
  errEmail.style.display = 'none';
  errPhone.style.display = 'none';

  if (!wizFullName.value.trim()) {
    errFullName.innerText = 'Full Name is required';
    errFullName.style.display = 'block';
    valid = false;
  }
  
  if (!wizEmail.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errEmail.innerText = 'Valid Email is required';
    errEmail.style.display = 'block';
    valid = false;
  }
  
  if (!wizPhone.value.match(/^\d{10}$/)) {
    errPhone.innerText = '10-digit phone number is required';
    errPhone.style.display = 'block';
    valid = false;
  }
  
  return valid;
}

function validateStep2() {
  let valid = true;
  errIncome.style.display = 'none';

  if (!wizIncome.value || Number(wizIncome.value) <= 0) {
    errIncome.innerText = 'Valid Monthly Income is required';
    errIncome.style.display = 'block';
    valid = false;
  }
  
  return valid;
}

function startCreditScanning() {
  currentWizardStep = 3;
  step1.style.display = 'none';
  step2.style.display = 'none';
  step3.style.display = 'block';
  document.getElementById('wizard-progress-container').style.display = 'none';

  setTimeout(() => {
    // Transition to step 4 Approved
    currentWizardStep = 4;
    step3.style.display = 'none';
    step4.style.display = 'block';

    // Trigger confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#f02fc2', '#00ff87', '#f5d061']
    });

    animateCreditScore();
    populateSanctionLetter();
  }, 2500);
}

function animateCreditScore() {
  const scoreNum = document.getElementById('credit-score-num');
  const arc = document.getElementById('credit-meter-arc');
  let current = 300;
  const target = 785;
  
  const timer = setInterval(() => {
    if (current < target) {
      current += 10;
      const val = Math.min(current, target);
      scoreNum.innerText = val;
      
      // Calculate arc rotation: score range 300-850 maps to -135deg to +135deg (270 degrees sweep)
      const ratio = (val - 300) / 550;
      const deg = -135 + ratio * 270;
      arc.style.transform = `rotate(${deg}deg)`;
    } else {
      clearInterval(timer);
    }
  }, 25);
}

let currentSanctionDetails = null;

function populateSanctionLetter() {
  const rate = getLoanRate();
  const P = Number(wizAmount.value) || 25000;
  const r = rate / 12 / 100;
  const n = Number(wizTenure.value) || 36;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const ref = `AP-${Math.floor(100000 + Math.random() * 900000)}`;
  const roundedEmi = Math.round(emi);
  
  document.getElementById('wiz-congrats-text').innerText = `Congratulations ${wizFullName.value}! Your financial parameters qualify for instant credit release.`;
  document.getElementById('sanction-ref').innerText = ref;
  document.getElementById('sanction-amount').innerText = formatCurrency(P);
  document.getElementById('sanction-term').innerText = `${n} Months`;
  document.getElementById('sanction-rate').innerText = `${rate}% p.a.`;
  document.getElementById('sanction-emi').innerText = formatCurrency(roundedEmi);

  currentSanctionDetails = {
    reference: ref,
    amount: P,
    tenure: n,
    rate: rate,
    emi: roundedEmi
  };
}

// Bind modal buttons
closeWizBtn.addEventListener('click', closeWizard);

document.getElementById('step1-next-btn').addEventListener('click', () => {
  if (validateStep1()) {
    currentWizardStep = 2;
    step1.style.display = 'none';
    step2.style.display = 'block';
    wizProgressFill.style.width = '100%';
  }
});

document.getElementById('step2-back-btn').addEventListener('click', () => {
  currentWizardStep = 1;
  step2.style.display = 'none';
  step1.style.display = 'block';
  wizProgressFill.style.width = '50%';
});

document.getElementById('step2-next-btn').addEventListener('click', () => {
  if (validateStep2()) {
    startCreditScanning();
  }
});

document.getElementById('download-letter-btn').addEventListener('click', () => {
  alert('Your Sanction Summary has been simulated as downloaded!');
});

document.getElementById('dashboard-home-btn').addEventListener('click', () => {
  if (currentSanctionDetails) {
    localStorage.setItem('aeropay_active_loan', JSON.stringify(currentSanctionDetails));
    checkActiveLoan();
  }
  closeWizard();
});

// Delegate apply button clicks
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.apply-trigger');
  if (trigger) {
    const loanType = trigger.getAttribute('data-loan') || 'personal';
    openWizard(loanType);
  }
});

/* ==========================================================================
   Dark/Light Theme Controller
   ========================================================================== */
const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('theme-icon-sun');
const moonIcon = document.getElementById('theme-icon-moon');

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark-theme');
  document.documentElement.classList.toggle('light-theme', !isDark);
  
  if (isDark) {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
});

let isDashExpanded = false;

function updateDashExpansionState() {
  const expandedBody = document.getElementById('active-loan-expanded-body');
  const chevron = document.getElementById('dash-chevron');
  if (isDashExpanded) {
    expandedBody.style.display = 'block';
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  } else {
    expandedBody.style.display = 'none';
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }
}

function checkActiveLoan() {
  const saved = localStorage.getItem('aeropay_active_loan');
  const wrapper = document.getElementById('active-loan-dashboard-wrapper');
  if (saved) {
    try {
      const loan = JSON.parse(saved);
      const paidCount = loan.paidCount || 0;
      const totalTerms = Number(loan.tenure) || 36;
      const emiAmount = Number(loan.emi) || 0;
      const outstandingBalance = loan.outstandingBalance !== undefined ? loan.outstandingBalance : (emiAmount * totalTerms);
      
      // Collapsed Short view
      document.getElementById('dash-ref-short').innerText = loan.reference;
      document.getElementById('dash-amount-short').innerText = formatCurrency(Number(loan.amount));
      document.getElementById('dash-tenure-short').innerText = totalTerms;
      document.getElementById('dash-balance-short').innerText = formatCurrency(outstandingBalance);
      
      // Expanded Detailed view
      document.getElementById('dash-amount').innerText = formatCurrency(Number(loan.amount));
      document.getElementById('dash-emi').innerText = formatCurrency(emiAmount);
      document.getElementById('dash-rate').innerText = `${loan.rate}% p.a.`;
      document.getElementById('dash-tenure').innerText = `${totalTerms} Months`;
      document.getElementById('dash-balance').innerText = formatCurrency(outstandingBalance);
      document.getElementById('dash-settled-count').innerText = `${paidCount} / ${totalTerms} Paid`;
      
      // Dynamic Status Badge
      const statusBadge = document.getElementById('dash-status-badge');
      if (statusBadge) {
        if (paidCount >= totalTerms) {
          statusBadge.innerText = '● fully repaid';
          statusBadge.style.background = 'rgba(255, 0, 127, 0.1)';
          statusBadge.style.color = '#ff007f';
          statusBadge.style.borderColor = 'rgba(255, 0, 127, 0.2)';
        } else if (paidCount > 0) {
          statusBadge.innerText = '● active / repaying';
          statusBadge.style.background = 'rgba(0, 242, 254, 0.1)';
          statusBadge.style.color = '#00f2fe';
          statusBadge.style.borderColor = 'rgba(0, 242, 254, 0.2)';
        } else {
          statusBadge.innerText = '● pending disbursal';
          statusBadge.style.background = 'rgba(0, 255, 135, 0.1)';
          statusBadge.style.color = '#00ff87';
          statusBadge.style.borderColor = 'rgba(0, 255, 135, 0.2)';
        }
      }

      // Dynamic Disbursal Progress Steps
      const disbursalSteps = document.getElementById('dash-disbursal-steps');
      if (disbursalSteps) {
        if (paidCount === 0) {
          disbursalSteps.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
              <span style="font-size: 0.85rem; font-weight: 600;">1. Credit FICO Verified</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
              <span style="font-size: 0.85rem; font-weight: 600;">2. Terms E-Signed</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div style="width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--accent-color); border-top-color: transparent; animation: spin 1s infinite linear; flex-shrink: 0;"></div>
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-color);">3. Disbursal Bank Transfer</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="alert-circle" style="color: var(--text-secondary); width: 16px; height: 16px;"></i>
              <span style="font-size: 0.85rem; color: var(--text-secondary);">4. Funded (Money in Bank)</span>
            </div>
          `;
        } else {
          disbursalSteps.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
              <span style="font-size: 0.85rem; font-weight: 600;">1. Credit FICO Verified</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
              <span style="font-size: 0.85rem; font-weight: 600;">2. Terms E-Signed</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
              <span style="font-size: 0.85rem; font-weight: 600;">3. Disbursal Bank Transfer</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
              <span style="font-size: 0.85rem; font-weight: 600;">4. Funded (Money in Bank)</span>
            </div>
          `;
        }
      }

      // Next Due Date
      const date = new Date();
      date.setMonth(date.getMonth() + 1 + paidCount);
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      document.getElementById('dash-next-due').innerText = dateStr;
      
      // Pay Button setup
      const payBtn = document.getElementById('pay-emi-btn');
      if (paidCount >= totalTerms) {
        payBtn.innerText = "Fully Repaid";
        payBtn.disabled = true;
        payBtn.style.background = 'rgba(255,255,255,0.05)';
        payBtn.style.cursor = 'not-allowed';
      } else {
        payBtn.innerHTML = `<i data-lucide="sparkles" style="width: 14px; height: 14px; margin-right: 4px;"></i>Pay EMI (${formatCurrency(emiAmount)})`;
        payBtn.disabled = false;
        payBtn.style.background = 'var(--primary-gradient)';
        payBtn.style.cursor = 'pointer';
      }
      
      wrapper.style.display = 'block';
      updateDashExpansionState();
    } catch (e) {
      console.error("Error parsing saved loan details:", e);
      localStorage.removeItem('aeropay_active_loan');
      wrapper.style.display = 'none';
    }
  } else {
    wrapper.style.display = 'none';
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Banner Expand/Collapse Toggle
document.getElementById('active-loan-banner').addEventListener('click', (e) => {
  if (e.target.closest('#reset-loan-btn') || e.target.closest('#pay-emi-btn') || e.target.closest('.glass-btn')) {
    return;
  }
  isDashExpanded = !isDashExpanded;
  updateDashExpansionState();
});

// Chevron Toggle Button Click
document.getElementById('dash-expand-toggle-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  isDashExpanded = !isDashExpanded;
  updateDashExpansionState();
});

// Pay Monthly EMI Click handler
document.getElementById('pay-emi-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  const saved = localStorage.getItem('aeropay_active_loan');
  if (!saved) return;
  
  const loan = JSON.parse(saved);
  const paidCount = loan.paidCount || 0;
  const totalTerms = Number(loan.tenure) || 36;
  const emiAmount = Number(loan.emi) || 0;
  const outstandingBalance = loan.outstandingBalance !== undefined ? loan.outstandingBalance : (emiAmount * totalTerms);
  
  if (paidCount >= totalTerms) {
    alert("This loan is already fully settled!");
    return;
  }
  
  const nextPaidCount = paidCount + 1;
  const nextOutstanding = Math.max(0, outstandingBalance - emiAmount);
  
  const updated = {
    ...loan,
    paidCount: nextPaidCount,
    outstandingBalance: nextOutstanding
  };
  
  localStorage.setItem('aeropay_active_loan', JSON.stringify(updated));
  checkActiveLoan();
  
  // Pay Success Confetti
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#00ff87', '#00f2fe', '#f5d061']
  });
});

document.getElementById('reset-loan-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  localStorage.removeItem('aeropay_active_loan');
  checkActiveLoan();
});

/* ==========================================================================
   Application Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadTestimonial();
  loadFAQs();
  calculateEMI();
  checkActiveLoan();
  
  // Render Vector Icons
  lucide.createIcons();
  
  // spotlight glows
  initializeSpotlightCards();
  
  // Re-run spotlight after dynamic products render
  setTimeout(initializeSpotlightCards, 100);
});
