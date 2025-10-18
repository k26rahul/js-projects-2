const html = String.raw;

const formEl = document.querySelector('form');
const tbodyEl = document.querySelector('tbody');
const errorEl = document.querySelector('#error-message');

const summaryLastMonthEl = document.querySelector('#summary-last-month');
const summaryMonthsEl = document.querySelector('#summary-months');
const summaryMonthlyEl = document.querySelector('#summary-monthly');
const summaryPrincipalEl = document.querySelector('#summary-principal');
const summaryInterestEl = document.querySelector('#summary-interest');
const summaryTotalEl = document.querySelector('#summary-total');

const inputs = formEl.querySelectorAll('input, select');
inputs.forEach(input => {
  const eventName = ['checkbox', 'radio'].includes(input.type) ? 'change' : 'input';
  input.addEventListener(eventName, updateLoanCalculation);
});

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

initializeThemeToggle();
updateLoanCalculation(); // initial render

function updateLoanCalculation() {
  const data = new FormData(formEl);
  const principal = parseFloat(data.get('principal'));
  const annualRate = parseFloat(data.get('annualRate'));
  const includeCurrentMonth = data.get('includeCurrentMonth') === 'on';
  const calculationMode = data.get('calculationMode'); // "fixedPayment" or "fixedDuration"

  const duration = parseInt(data.get('duration'));
  let monthlyPayment = parseFloat(data.get('monthlyPayment'));

  toggleError(); // hide error

  // check invalid values
  const errorMessage = validateInputs({ principal, annualRate, calculationMode, monthlyPayment });
  if (errorMessage) {
    toggleError(errorMessage);
    return;
  }

  const schedule = [];
  const monthlyRate = annualRate / 12 / 100; // [0-100] % p.a. -> [0-1] monthly rate
  let balance = principal;
  let totalMonths = 0;

  // find monthlyPayment
  if (calculationMode === 'fixedDuration') {
    // formula: emi = p * r * (1+r)^n / ((1+r)^n - 1)
    const n = duration;
    const r = monthlyRate;
    if (r === 0) {
      monthlyPayment = principal / n;
    } else {
      monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  // amortization loop
  while (balance > 0) {
    totalMonths++;

    const interest = balance * monthlyRate;
    let principalPaid = monthlyPayment - interest;

    if (principalPaid <= 0) {
      const message =
        calculationMode === 'fixedDuration'
          ? 'Loan duration is too long. Please decrease the number of months.'
          : `Monthly payment will never pay off the loan. Increase above ${rupeeFormatter.format(
              interest
            )}.`;
      toggleError(message);
      return;
    }

    balance -= principalPaid;
    balance = balance > 0 && balance <= 0.01 ? 0 : balance; // (0, 0.01] -> 0
    schedule.push({ principalPaid, interest, balance });
  }

  updateUI({
    schedule,
    totalMonths,
    includeCurrentMonth,
    monthlyPayment,
    principal,
    balance,
  });
}

function updateUI({
  schedule,
  totalMonths,
  includeCurrentMonth,
  monthlyPayment,
  principal,
  balance,
}) {
  // clear previous table content
  tbodyEl.innerHTML = '';

  // reset summary fields to dashes
  summaryLastMonthEl.textContent = '—';
  summaryMonthsEl.textContent = '—';
  summaryMonthlyEl.textContent = '—';
  summaryPrincipalEl.textContent = '—';
  summaryInterestEl.textContent = '—';
  summaryTotalEl.textContent = '—';

  // if schedule is undefined, stop here
  if (!schedule) return;

  // otherwise, fill table and summary values
  const date = new Date();
  let formattedDate;
  date.setMonth(date.getMonth() - includeCurrentMonth); // start from current/next month

  schedule.forEach(({ principalPaid, interest, balance }) => {
    date.setMonth(date.getMonth() + 1); // increase the month
    formattedDate = date.toLocaleDateString(undefined, {
      month: 'short',
      year: 'numeric',
    });

    if (balance <= 0) {
      principalPaid += balance;
      balance = 0;
    }

    const _html = html`
      <tr>
        <td>${formattedDate}</td>
        <td>${rupeeFormatter.format(principalPaid)}</td>
        <td>${rupeeFormatter.format(interest)}</td>
        <td>${rupeeFormatter.format(balance)}</td>
      </tr>
    `;
    tbodyEl.insertAdjacentHTML('beforeend', _html);
  });

  const totalPayment = monthlyPayment * totalMonths + balance;
  summaryLastMonthEl.textContent = formattedDate; // last month from schedule forEach
  summaryMonthsEl.textContent = totalMonths;
  summaryMonthlyEl.textContent = rupeeFormatter.format(monthlyPayment);
  summaryPrincipalEl.textContent = rupeeFormatter.format(principal);
  summaryInterestEl.textContent = rupeeFormatter.format(totalPayment - principal);
  summaryTotalEl.textContent = rupeeFormatter.format(totalPayment);
}

function validateInputs({ principal, annualRate, calculationMode, monthlyPayment }) {
  if (principal <= 0) {
    return 'Principal must be greater than 0';
  }
  if (annualRate < 0) {
    return 'Annual rate cannot be negative';
  }
  if (calculationMode === 'fixedPayment' && monthlyPayment <= 0) {
    return 'Monthly payment must be greater than 0';
  }
  return null; // no error
}

function toggleError(message) {
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    updateUI({}); // clear table
  } else {
    errorEl.hidden = true;
  }
}

function initializeThemeToggle() {
  const themeToggle = document.querySelector('#theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    const isDark = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
