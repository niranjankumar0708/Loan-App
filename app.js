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
    icon: 'user',
    image: 'images/personal_loan.png',
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
    features: ['Lowest interest rates', 'Up to 30 year tenure', 'Zero prepayment charges'],
    icon: 'home',
    image: 'images/home_loan.png',
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
    features: ['Up to 90% funding', 'Minimal paperwork', 'Flexible repayment terms'],
    icon: 'car',
    image: 'images/auto_loan.png',
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
    features: ['Grace period post study', 'Covers tuition & boarding', 'Tax benefits on interest'],
    icon: 'graduation-cap',
    image: 'images/education_loan.png',
    schemes: [
      { name: 'Vidya Lakshmi', rate: '5.0% p.a.', desc: 'Government-sponsored interest subsidy during the study moratorium.' },
      { name: 'Study Abroad Premium', rate: '6.0% p.a.', desc: 'Covers entire tuition fees, boarding, travel tickets, and laptop expenses.' },
      { name: 'Vocational Skill', rate: '5.5% p.a.', desc: 'Low-cost loans for certified vocational courses and skill development.' }
    ]
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
// Active scheme index mapping
const activeSchemes = {
  personal: 0,
  home: 0,
  auto: 0,
  education: 0
};

window.selectStaticScheme = function(productId, idx) {
  activeSchemes[productId] = idx;
  const p = PRODUCTS.find(prod => prod.id === productId);
  const scheme = p.schemes[idx];
  
  // Update display rate
  const rateValEl = document.querySelector(`.product-card-${productId} .product-rate-val`);
  if (rateValEl) rateValEl.innerText = scheme.rate;
  
  // Update active tab class
  const tabs = document.querySelectorAll(`.product-card-${productId} .scheme-tab`);
  tabs.forEach((tab, tIdx) => {
    if (tIdx === idx) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update description box
  const descEl = document.querySelector(`.product-card-${productId} .scheme-desc-box p`);
  if (descEl) descEl.innerText = scheme.desc;
};

function loadProducts() {
  const container = document.getElementById('products-grid-container');
  let html = '';
  
  PRODUCTS.forEach(p => {
    let featuresHtml = '';
    p.features.forEach(f => {
      featuresHtml += `<li><i data-lucide="check" style="width: 14px; height: 14px;"></i>${f}</li>`;
    });

    let schemesHtml = '';
    let activeScheme = p.schemes[0];
    p.schemes.forEach((s, idx) => {
      schemesHtml += `<button class="scheme-tab ${idx === 0 ? 'active' : ''}" onclick="selectStaticScheme('${p.id}', ${idx})">${s.name}</button>`;
    });

    html += `
      <div class="glass-card product-card product-card-${p.id}" style="display: flex; flex-direction: column;">
        ${p.image ? `
        <div class="product-image-wrap">
          <img src="${p.image}" alt="${p.title}" class="product-image" />
        </div>
        ` : ''}
        
        <div class="product-header-row">
          <div class="product-icon icon-${p.id}">
            <i data-lucide="${p.icon}"></i>
          </div>
          <h3 class="product-title">${p.title}</h3>
        </div>
        <p class="product-desc">Optimized loan structures for your core ${p.title.toLowerCase()} goals.</p>
        
        <div class="product-meta">
          <span class="product-rate-lbl">Rate of Interest</span>
          <span class="product-rate-val">${activeScheme.rate}</span>
        </div>

        <ul class="product-features">
          ${featuresHtml}
        </ul>

        <div class="product-schemes-section">
          <span class="schemes-section-title">Available Schemes</span>
          <div class="schemes-tabs">
            ${schemesHtml}
          </div>
          <div class="scheme-desc-box">
            <p>${activeScheme.desc}</p>
          </div>
        </div>

        <button class="glass-btn glass-btn-primary apply-trigger" data-loan="${p.id}" style="width: 100%; margin-top: auto;">
          Apply for ${p.title.split(' ')[0]}
        </button>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
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
const step5 = document.getElementById('wizard-step-5');

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

// Static Plaid Integration variables
let staticBankVerified = false;
let staticSelectedBank = '';
let staticPlaidStep = 'select';

// Upload States
let staticUploadedFiles = { idProof: null, incomeProof: null };

function openWizard(loanType = 'personal') {
  currentLoanType = loanType;
  currentWizardStep = 1;
  
  // Set defaults based on product type
  let amount = 25000;
  if (loanType === 'home') amount = 150000;
  if (loanType === 'auto') amount = 35000;
  if (loanType === 'education') amount = 45000;

  wizAmount.value = amount;
  
  // Reset verification states
  staticBankVerified = false;
  staticSelectedBank = '';
  staticUploadedFiles = { idProof: null, incomeProof: null };
  
  document.getElementById('plaid-connect-btn').style.display = 'flex';
  document.getElementById('plaid-verified-banner').style.display = 'none';
  wizIncome.disabled = false;
  wizIncome.style.opacity = '1';
  wizIncome.style.color = '';
  wizIncome.style.fontWeight = '';
  wizIncome.value = '';
  
  // Reset uploads
  document.getElementById('id-upload-btn').style.display = 'block';
  document.getElementById('id-upload-success').style.display = 'none';
  document.getElementById('id-upload-progress-wrap').style.display = 'none';
  document.getElementById('income-upload-btn').style.display = 'block';
  document.getElementById('income-upload-success').style.display = 'none';
  document.getElementById('income-upload-progress-wrap').style.display = 'none';
  document.getElementById('step3-next-btn').classList.add('disabled');
  document.getElementById('step3-next-btn').disabled = true;

  // Display Step 1
  step1.style.display = 'block';
  step2.style.display = 'none';
  step3.style.display = 'none';
  step4.style.display = 'none';
  step5.style.display = 'none';
  
  wizProgressFill.style.width = '33%';
  document.getElementById('wizard-progress-container').style.display = 'block';
  
  wizardModal.style.display = 'flex';
  
  // Clear Errors
  [errFullName, errEmail, errPhone, errIncome].forEach(err => err.style.display = 'none');
}

function closeWizard() {
  wizardModal.style.display = 'none';
}

function getLoanRate() {
  const baseRate = (() => {
    switch (currentLoanType) {
      case 'home': return 6.8;
      case 'auto': return 7.5;
      case 'education': return 5.5;
      case 'personal':
      default: return 8.5;
    }
  })();
  
  // Plaid discount
  return staticBankVerified ? parseFloat((baseRate - 0.3).toFixed(1)) : baseRate;
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

// Plaid Overlay controls
const plaidOverlay = document.getElementById('plaid-overlay');
document.getElementById('plaid-connect-btn').addEventListener('click', () => {
  setPlaidStepStatic('select');
  plaidOverlay.style.display = 'flex';
});

document.getElementById('plaid-close-btn').addEventListener('click', () => {
  plaidOverlay.style.display = 'none';
});

window.setPlaidStepStatic = function(step) {
  staticPlaidStep = step;
  document.getElementById('plaid-step-select').style.display = step === 'select' ? 'block' : 'none';
  document.getElementById('plaid-step-credentials').style.display = step === 'credentials' ? 'block' : 'none';
  document.getElementById('plaid-step-loading').style.display = step === 'loading' ? 'block' : 'none';
  document.getElementById('plaid-step-success').style.display = step === 'success' ? 'block' : 'none';
};

window.selectStaticBank = function(bankName) {
  staticSelectedBank = bankName;
  document.getElementById('plaid-bank-login-title').innerText = `Log in to ${bankName} Online Banking`;
  setPlaidStepStatic('credentials');
};

window.submitStaticPlaid = function() {
  setPlaidStepStatic('loading');
  document.getElementById('plaid-loading-text').innerText = `Connecting securely to ${staticSelectedBank}...`;
  
  setTimeout(() => {
    setPlaidStepStatic('success');
    document.getElementById('plaid-success-title').innerText = `${staticSelectedBank} linked successfully!`;
    staticBankVerified = true;
    wizIncome.value = '6200';
    errIncome.style.display = 'none';
    
    // Disable input and highlight
    wizIncome.disabled = true;
    wizIncome.style.opacity = '0.8';
    wizIncome.style.color = '#00ff87';
    wizIncome.style.fontWeight = 'bold';
    
    // Update banner
    document.getElementById('plaid-connect-btn').style.display = 'none';
    const verifiedBanner = document.getElementById('plaid-verified-banner');
    document.getElementById('plaid-bank-name').innerText = `${staticSelectedBank} Connected Instantly`;
    verifiedBanner.style.display = 'flex';
    
    // Auto complete Income Proof on step 3
    document.getElementById('income-upload-btn').style.display = 'none';
    const successLabel = document.getElementById('income-upload-success');
    successLabel.innerHTML = `<i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i><span>Automatically Verified via Plaid connection</span>`;
    successLabel.style.color = '#00ff87';
    successLabel.style.display = 'flex';
    lucide.createIcons();
    
    setTimeout(() => {
      plaidOverlay.style.display = 'none';
    }, 1200);
  }, 2000);
};

document.getElementById('plaid-disconnect-btn').addEventListener('click', () => {
  staticBankVerified = false;
  staticSelectedBank = '';
  wizIncome.disabled = false;
  wizIncome.style.opacity = '1';
  wizIncome.style.color = '';
  wizIncome.style.fontWeight = '';
  wizIncome.value = '';
  
  document.getElementById('plaid-connect-btn').style.display = 'flex';
  document.getElementById('plaid-verified-banner').style.display = 'none';
  
  // Reset step 3 income upload
  document.getElementById('income-upload-btn').style.display = 'block';
  document.getElementById('income-upload-success').style.display = 'none';
  checkKycCompletion();
});

// File Upload Simulations
function triggerFileUploadStatic(type) {
  const btn = document.getElementById(`${type}-upload-btn`);
  const progressWrap = document.getElementById(`${type}-upload-progress-wrap`);
  const progressBar = document.getElementById(`${type}-upload-progress-bar`);
  const text = document.getElementById(`${type}-upload-text`);
  
  btn.style.display = 'none';
  progressWrap.style.display = 'block';
  progressBar.style.width = '10%';
  text.innerText = 'Uploading... 10%';
  
  let progress = 10;
  const timer = setInterval(() => {
    progress += 30;
    if (progress >= 100) {
      clearInterval(timer);
      progressWrap.style.display = 'none';
      
      const success = document.getElementById(`${type}-upload-success`);
      const filename = document.getElementById(`${type}-upload-filename`);
      filename.innerText = type === 'id' ? 'national_identity_card.pdf' : 'latest_paystub_verified.pdf';
      success.style.display = 'flex';
      
      staticUploadedFiles[type === 'id' ? 'idProof' : 'incomeProof'] = true;
      checkKycCompletion();
    } else {
      progressBar.style.width = `${progress}%`;
      text.innerText = `Uploading... ${progress}%`;
    }
  }, 250);
}

document.getElementById('id-upload-btn').addEventListener('click', () => triggerFileUploadStatic('id'));
document.getElementById('income-upload-btn').addEventListener('click', () => triggerFileUploadStatic('income'));

function checkKycCompletion() {
  const completed = staticUploadedFiles.idProof && (staticBankVerified || staticUploadedFiles.incomeProof);
  const nextBtn = document.getElementById('step3-next-btn');
  if (completed) {
    nextBtn.classList.remove('disabled');
    nextBtn.disabled = false;
  } else {
    nextBtn.classList.add('disabled');
    nextBtn.disabled = true;
  }
}

function startCreditScanning() {
  currentWizardStep = 4;
  step1.style.display = 'none';
  step2.style.display = 'none';
  step3.style.display = 'none';
  step4.style.display = 'block';
  document.getElementById('wizard-progress-container').style.display = 'none';

  const consoleContainer = document.getElementById('ocr-log-console-container');
  consoleContainer.innerHTML = '<div class="ocr-log-cursor"></div>';

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
  ];

  let currentIdx = 0;
  const logTimer = setInterval(() => {
    if (currentIdx < logMessages.length) {
      const line = document.createElement('div');
      line.className = 'ocr-log-line';
      line.innerHTML = `<span class="log-arrow">&gt;</span> ${logMessages[currentIdx]}`;
      consoleContainer.insertBefore(line, consoleContainer.lastElementChild);
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
      currentIdx++;
    } else {
      clearInterval(logTimer);
      
      setTimeout(() => {
        // Transition to step 5 Approved
        currentWizardStep = 5;
        step4.style.display = 'none';
        step5.style.display = 'block';

        // Trigger confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#f02fc2', '#00ff87', '#f5d061']
        });

        animateCreditScore();
        populateSanctionLetter();
      }, 800);
    }
  }, 600);
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
  
  // Rate display with Plaid discount info
  if (staticBankVerified) {
    document.getElementById('sanction-rate').innerHTML = `${rate}% p.a. <span style="font-size: 0.75rem; margin-left: 0.3rem; color: #00f2fe;">(Plaid discount applied)</span>`;
  } else {
    document.getElementById('sanction-rate').innerText = `${rate}% p.a.`;
  }
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
    wizProgressFill.style.width = '66%';
  }
});

document.getElementById('step2-back-btn').addEventListener('click', () => {
  currentWizardStep = 1;
  step2.style.display = 'none';
  step1.style.display = 'block';
  wizProgressFill.style.width = '33%';
});

document.getElementById('step2-next-btn').addEventListener('click', () => {
  if (validateStep2()) {
    currentWizardStep = 3;
    step2.style.display = 'none';
    step3.style.display = 'block';
    wizProgressFill.style.width = '100%';
    checkKycCompletion();
  }
});

document.getElementById('step3-back-btn').addEventListener('click', () => {
  currentWizardStep = 2;
  step3.style.display = 'none';
  step2.style.display = 'block';
  wizProgressFill.style.width = '66%';
});

document.getElementById('step3-next-btn').addEventListener('click', () => {
  startCreditScanning();
});

document.getElementById('download-letter-btn').addEventListener('click', () => {
  alert('Your Sanction Summary has been simulated as downloaded!');
});

document.getElementById('dashboard-home-btn').addEventListener('click', () => {
  if (currentSanctionDetails) {
    let activeLoans = [];
    try {
      const saved = localStorage.getItem('aeropay_active_loans');
      activeLoans = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(activeLoans)) activeLoans = [];
    } catch (e) {
      activeLoans = [];
    }
    
    if (!activeLoans.some(l => l.reference === currentSanctionDetails.reference)) {
      activeLoans.push(currentSanctionDetails);
    }
    localStorage.setItem('aeropay_active_loans', JSON.stringify(activeLoans));
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

let expandedLoansState = {};

function checkActiveLoan() {
  // Legacy migration
  const legacyLoan = localStorage.getItem('aeropay_active_loan');
  let migratedLoans = [];
  if (legacyLoan) {
    try {
      const parsedLegacy = JSON.parse(legacyLoan);
      if (parsedLegacy && parsedLegacy.reference) {
        migratedLoans.push(parsedLegacy);
      }
    } catch (e) {
      // ignore parsing error
    }
    localStorage.removeItem('aeropay_active_loan');
  }

  // Initialize mock past loans if not set
  let savedPast = localStorage.getItem('aeropay_past_loans');
  if (!savedPast) {
    const initialMock = [
      {
        reference: 'AP-84920',
        type: 'personal',
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
        amount: 32000,
        rate: 5.8,
        tenure: 48,
        emi: 748.24,
        settledDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: 'Fully Settled'
      }
    ];
    localStorage.setItem('aeropay_past_loans', JSON.stringify(initialMock));
    savedPast = JSON.stringify(initialMock);
  }

  let pastLoans = [];
  try {
    pastLoans = JSON.parse(savedPast) || [];
  } catch (e) {
    pastLoans = [];
  }

  // Load active loans list
  const savedLoans = localStorage.getItem('aeropay_active_loans');
  let activeLoans = [];
  if (savedLoans) {
    try {
      activeLoans = JSON.parse(savedLoans);
      if (!Array.isArray(activeLoans)) {
        activeLoans = [];
      }
    } catch (e) {
      activeLoans = [];
    }
  }

  const combinedActive = [...activeLoans];
  migratedLoans.forEach(mig => {
    if (!combinedActive.some(l => l.reference === mig.reference)) {
      combinedActive.push(mig);
    }
  });

  if (migratedLoans.length > 0 || !savedLoans) {
    localStorage.setItem('aeropay_active_loans', JSON.stringify(combinedActive));
    activeLoans = combinedActive;
  }

  const wrapper = document.getElementById('active-loan-dashboard-wrapper');
  
  if (activeLoans.length > 0 || pastLoans.length > 0) {
    wrapper.style.display = 'block';
  } else {
    wrapper.style.display = 'none';
  }

  // Render Active Loans
  const activeContainer = document.getElementById('active-loans-container');
  if (activeContainer) {
    if (activeLoans.length > 0) {
      activeContainer.innerHTML = activeLoans.map((loan) => {
        const paidCount = loan.paidCount || 0;
        const totalTerms = Number(loan.tenure) || 36;
        const emiAmount = Number(loan.emi) || 0;
        const outstandingBalance = loan.outstandingBalance !== undefined ? loan.outstandingBalance : (emiAmount * totalTerms);
        const isExpanded = !!expandedLoansState[loan.reference];

        const date = new Date();
        date.setMonth(date.getMonth() + 1 + paidCount);
        const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        return `
          <div class="glass-card active-loan-card-item" data-ref="${loan.reference}" style="border: 1px solid rgba(0, 255, 135, 0.25); background: rgba(0, 255, 135, 0.01); box-shadow: 0 8px 32px 0 rgba(0, 255, 135, 0.04); padding: 1.5rem; cursor: pointer; margin-bottom: 2rem;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.8rem;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(0, 255, 135, 0.1); color: #00ff87; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <i data-lucide="landmark"></i>
                </div>
                <div>
                  <h3 style="font-size: 1.05rem; font-weight: 700; font-family: var(--font-family-title); display: flex; align-items: center; gap: 0.5rem; margin: 0;">
                    Active Loan Portal
                    ${paidCount >= totalTerms ? `
                      <span class="glass-badge" style="background: rgba(255, 0, 127, 0.1); color: #ff007f; border: 1px solid rgba(255, 0, 127, 0.2); font-size: 0.7rem; padding: 0.15rem 0.5rem;">
                        ● fully repaid
                      </span>
                    ` : paidCount > 0 ? `
                      <span class="glass-badge" style="background: rgba(0, 242, 254, 0.1); color: #00f2fe; border: 1px solid rgba(0, 242, 254, 0.2); font-size: 0.7rem; padding: 0.15rem 0.5rem;">
                        ● active / repaying
                      </span>
                    ` : `
                      <span class="glass-badge" style="background: rgba(0, 255, 135, 0.1); color: #00ff87; border: 1px solid rgba(0, 255, 135, 0.2); font-size: 0.7rem; padding: 0.15rem 0.5rem;">
                        ● pending disbursal
                      </span>
                    `}
                  </h3>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0.3rem 0 0 0;">
                    Ref: <span style="color: var(--text-primary); font-weight: 600;">${loan.reference}</span> • 
                    Principal: <span style="color: var(--text-primary); font-weight: 600;">${formatCurrency(Number(loan.amount))}</span> • 
                    Term: <span style="color: var(--text-primary); font-weight: 600;">${totalTerms}</span> Months
                  </p>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; gap: 1rem;" class="card-action-block">
                <div style="text-align: right; font-size: 0.85rem;" class="quick-balance-display">
                  <span style="color: var(--text-secondary);">Outstanding: </span>
                  <span style="font-weight: 700; color: #ff007f;">${formatCurrency(outstandingBalance)}</span>
                </div>

                <button 
                  class="dash-expand-toggle-btn-dyn"
                  style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; padding: 0.4rem;"
                  aria-label="Expand details"
                >
                  <i data-lucide="chevron-down" class="dash-chevron-dyn" style="transform: rotate(${isExpanded ? 180 : 0}deg); transition: transform 0.3s ease;"></i>
                </button>
                
                <button 
                  class="reset-loan-btn-dyn"
                  style="background: transparent; border: none; color: #ff007f; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; padding: 0.4rem 0.6rem; border-radius: 8px;"
                >
                  <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                  Reset
                </button>
              </div>
            </div>

            <div class="active-loan-expanded-body-dyn" style="display: ${isExpanded ? 'block' : 'none'}; margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 2rem; animation: modal-enter 0.4s ease-out;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
                <div>
                  <span style="font-size: 0.78rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Sanctioned Principal</span>
                  <h4 style="font-size: 1.6rem; font-weight: 800; margin-top: 0.2rem; color: var(--text-primary);">${formatCurrency(Number(loan.amount))}</h4>
                </div>
                <div>
                  <span style="font-size: 0.78rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Monthly Installment (EMI)</span>
                  <h4 style="font-size: 1.6rem; font-weight: 800; margin-top: 0.2rem; color: var(--accent-color);">${formatCurrency(emiAmount)}</h4>
                </div>
                <div>
                  <span style="font-size: 0.78rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Rate of Interest</span>
                  <h4 style="font-size: 1.6rem; font-weight: 800; margin-top: 0.2rem; color: var(--text-primary);">${loan.rate}% p.a.</h4>
                </div>
                <div>
                  <span style="font-size: 0.78rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Total Term Length</span>
                  <h4 style="font-size: 1.6rem; font-weight: 800; margin-top: 0.2rem; color: var(--text-primary);">${totalTerms} Months</h4>
                </div>
              </div>

              <div class="dashboard-two-column">
                <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem;" class="repayment-block-dyn">
                  <h4 style="font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-family-title); margin: 0;">
                    <i data-lucide="credit-card" style="color: var(--accent-color); width: 16px; height: 16px;"></i>
                    Pending Repayment Summary
                  </h4>

                  <div class="dashboard-inner-two-col">
                    <div>
                      <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Remaining Balance</span>
                      <p style="font-size: 1.4rem; font-weight: 700; color: #ff007f; margin: 0.1rem 0 0 0;">${formatCurrency(outstandingBalance)}</p>
                    </div>
                    <div>
                      <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">EMIs Settled</span>
                      <p style="font-size: 1.4rem; font-weight: 700; margin: 0.1rem 0 0 0;">${paidCount} / ${totalTerms} Paid</p>
                    </div>
                  </div>

                  <div style="border-top: 1px solid var(--glass-border); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                      <span style="font-size: 0.75rem; color: var(--text-secondary);">Next EMI Installment Due</span>
                      <p style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin: 0.2rem 0 0 0;">${dateStr}</p>
                    </div>

                    <button 
                      class="pay-emi-btn-dyn glass-btn glass-btn-primary"
                      style="padding: 0.6rem 1.2rem; font-size: 0.85rem; cursor: ${paidCount >= totalTerms ? 'not-allowed' : 'pointer'}; background: ${paidCount >= totalTerms ? 'rgba(255,255,255,0.05)' : 'var(--primary-gradient)'};"
                      ${paidCount >= totalTerms ? 'disabled' : ''}
                    >
                      ${paidCount >= totalTerms ? 'Fully Repaid' : `
                        <i data-lucide="sparkles" style="width: 14px; height: 14px; margin-right: 4px;"></i>
                        Pay EMI (${formatCurrency(emiAmount)})
                      `}
                    </button>
                  </div>
                </div>

                <div style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.5rem;">
                  <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-family-title); margin-top: 0;">
                    <i data-lucide="file-text" style="width: 16px; height: 16px; color: var(--accent-color);"></i>
                    Disbursal Progress
                  </h4>
                  
                  <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
                      <span style="font-size: 0.85rem; font-weight: 600;">1. Credit FICO Verified</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
                      <span style="font-size: 0.85rem; font-weight: 600;">2. Terms E-Signed</span>
                    </div>

                    ${paidCount === 0 ? `
                      <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <div style="width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--accent-color); border-top-color: transparent; animation: spin 1s infinite linear; flex-shrink: 0;"></div>
                        <span style="font-size: 0.85rem; font-weight: 600; color: var(--accent-color);">3. Disbursal Bank Transfer</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <i data-lucide="alert-circle" style="color: var(--text-secondary); width: 16px; height: 16px;"></i>
                        <span style="font-size: 0.85rem; color: var(--text-secondary);">4. Funded (Money in Bank)</span>
                      </div>
                    ` : `
                      <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
                        <span style="font-size: 0.85rem; font-weight: 600;">3. Disbursal Bank Transfer</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <i data-lucide="check-circle-2" style="color: #00ff87; width: 16px; height: 16px;"></i>
                        <span style="font-size: 0.85rem; font-weight: 600;">4. Funded (Money in Bank)</span>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      activeContainer.innerHTML = '';
    }
  }

  // Render Ledger List
  const ledgerCard = document.getElementById('past-loans-ledger-card');
  const tableBody = document.getElementById('past-loans-table-body');
  if (ledgerCard && tableBody) {
    if (pastLoans.length > 0) {
      ledgerCard.style.display = 'block';
      tableBody.innerHTML = pastLoans.map((pLoan, idx) => `
        <tr style="border-bottom: ${idx === pastLoans.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)'};" class="table-row-hover">
          <td style="padding: 1rem; font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${pLoan.reference}</td>
          <td style="padding: 1rem; font-size: 0.85rem; color: var(--text-secondary); text-transform: capitalize;">${pLoan.type} Loan</td>
          <td style="padding: 1rem; font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${formatCurrency(pLoan.amount)}</td>
          <td style="padding: 1rem; font-size: 0.85rem; color: var(--text-primary);">
            ${formatCurrency(pLoan.emi)} <span style="color: var(--accent-color); font-size: 0.75rem;">(${pLoan.rate}%)</span>
          </td>
          <td style="padding: 1rem; font-size: 0.85rem; color: var(--text-primary);">${pLoan.tenure} Mos</td>
          <td style="padding: 1rem; font-size: 0.85rem; color: var(--text-secondary);">${pLoan.settledDate}</td>
          <td style="padding: 1rem; text-align: right;">
            <span class="glass-badge" style="background: rgba(0, 255, 135, 0.1); color: #00ff87; border: 1px solid rgba(0, 255, 135, 0.2); font-size: 0.7rem; padding: 0.15rem 0.5rem;">
              ● ${pLoan.status || 'Fully Settled'}
            </span>
          </td>
        </tr>
      `).join('');
    } else {
      ledgerCard.style.display = 'none';
    }
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Delegate click events inside active loans container
document.addEventListener('DOMContentLoaded', () => {
  const activeContainer = document.getElementById('active-loans-container');
  if (activeContainer) {
    activeContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.active-loan-card-item');
      if (!card) return;
      const ref = card.getAttribute('data-ref');

      // 1. Reset/Remove Loan
      const resetBtn = e.target.closest('.reset-loan-btn-dyn');
      if (resetBtn) {
        e.stopPropagation();
        let activeLoans = [];
        try {
          activeLoans = JSON.parse(localStorage.getItem('aeropay_active_loans')) || [];
        } catch (err) {
          activeLoans = [];
        }
        activeLoans = activeLoans.filter(l => l.reference !== ref);
        localStorage.setItem('aeropay_active_loans', JSON.stringify(activeLoans));
        checkActiveLoan();
        return;
      }

      // 2. Pay EMI
      const payBtn = e.target.closest('.pay-emi-btn-dyn');
      if (payBtn) {
        e.stopPropagation();
        if (payBtn.disabled) return;

        let activeLoans = [];
        try {
          activeLoans = JSON.parse(localStorage.getItem('aeropay_active_loans')) || [];
        } catch (err) {
          activeLoans = [];
        }
        const loanIdx = activeLoans.findIndex(l => l.reference === ref);
        if (loanIdx === -1) return;

        const loan = activeLoans[loanIdx];
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

        activeLoans[loanIdx] = {
          ...loan,
          paidCount: nextPaidCount,
          outstandingBalance: nextOutstanding
        };

        // Archive if paid off
        if (nextPaidCount >= totalTerms) {
          let currentPast = [];
          try {
            currentPast = JSON.parse(localStorage.getItem('aeropay_past_loans')) || [];
          } catch (err) {
            currentPast = [];
          }
          if (!currentPast.some(l => l.reference === loan.reference)) {
            currentPast.unshift({
              reference: loan.reference,
              type: loan.type || 'personal',
              amount: loan.amount,
              rate: loan.rate,
              tenure: loan.tenure,
              emi: loan.emi,
              settledDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              status: 'Fully Settled'
            });
            localStorage.setItem('aeropay_past_loans', JSON.stringify(currentPast));
          }
        }

        localStorage.setItem('aeropay_active_loans', JSON.stringify(activeLoans));
        checkActiveLoan();

        // Pay Success Confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00ff87', '#00f2fe', '#f5d061']
        });
        return;
      }

      // 3. Toggle Expansion
      if (!e.target.closest('.card-action-block') && !e.target.closest('.repayment-block-dyn') && !e.target.closest('a') && !e.target.closest('button')) {
        expandedLoansState[ref] = !expandedLoansState[ref];
        checkActiveLoan();
      } else if (e.target.closest('.dash-expand-toggle-btn-dyn')) {
        e.stopPropagation();
        expandedLoansState[ref] = !expandedLoansState[ref];
        checkActiveLoan();
      }
    });
  }
});

document.getElementById('clear-past-loans-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  localStorage.removeItem('aeropay_past_loans');
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
