const html = String.raw;

const form = document.querySelector('.loan-form');
const tbody = document.querySelector('.loan-schedule tbody');
const errorEl = document.querySelector('#summary-error');

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inputs = form.querySelectorAll('input, select');
inputs.forEach(input => {
  const eventName = input.type === 'checkbox' || input.type === 'radio' ? 'change' : 'input';
  input.addEventListener(eventName, updateLoanCalculation);
});

initializeThemeToggle();
updateLoanCalculation(); // initial render

function updateLoanCalculation() {
  const data = new FormData(form);
  const principal = parseFloat(data.get('principal'));
  const annualRate = parseFloat(data.get('rate'));
  const includeCurrent = data.get('includeCurrent') === 'on';
  const mode = data.get('calcMode'); // now "fixed-payment" or "fixed-duration"

  // check empty values
  if (!principal || !annualRate) {
    renderSchedule([], null); // empty schedule, no rows will be shown in table
    return;
  }

  // hide error
  errorEl.hidden = true;

  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  let payment, totalMonths;

  // decide payment based on mode
  if (mode === 'fixed-payment') {
    totalMonths = null; // unknown, determined by amortization

    payment = parseFloat(data.get('payment'));
    if (!payment) {
      renderSchedule([], null);
      return;
    }

    // quick impossible-loan check
    const firstInterest = balance * monthlyRate;
    if (payment <= firstInterest) {
      errorEl.hidden = false; // show error
      renderSchedule([], null);
      return;
    }
  } else if (mode === 'fixed-duration') {
    totalMonths = parseInt(data.get('months'));

    // formula: emi = p * r * (1+r)^n / ((1+r)^n - 1)
    const n = totalMonths;
    const r = monthlyRate;
    if (r === 0) {
      payment = principal / n;
    } else {
      payment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  // amortization loop
  let date = new Date();
  if (!includeCurrent) {
    date.setMonth(date.getMonth() + 1);
  }

  const schedule = [];
  let monthCount = 0;

  while (balance > 0) {
    monthCount++;

    const interest = balance * monthlyRate;
    let principalPaid = payment - interest;

    if (principalPaid > balance) principalPaid = balance; // don't pay more than balance
    balance -= principalPaid;
    if (balance < 1) balance = 0; // balance is ₹1, pay it next month.. no!

    schedule.push({
      month: date.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      principalPaid,
      interest,
      balance,
    });

    date.setMonth(date.getMonth() + 1);

    if (monthCount > 1000) {
      console.warn('Payment too low to ever pay off the loan.');
      break;
    }
  }

  renderSchedule(schedule, payment);
}

function renderSchedule(schedule, monthlyPayment) {
  const elLastMonth = document.querySelector('#summary-last-month');
  const elMonths = document.querySelector('#summary-months');
  const elMonthly = document.querySelector('#summary-monthly');
  const elPrincipal = document.querySelector('#summary-principal');
  const elInterest = document.querySelector('#summary-interest');
  const elTotal = document.querySelector('#summary-total');

  // clear previous table content
  tbody.innerHTML = '';

  // reset summary fields to dashes
  elLastMonth.textContent = '—';
  elMonths.textContent = '—';
  elMonthly.textContent = '—';
  elPrincipal.textContent = '—';
  elInterest.textContent = '—';
  elTotal.textContent = '—';

  // if schedule is empty, stop here
  if (schedule.length === 0) return;

  // otherwise, fill table and summary values
  let totalPrincipal = 0;
  let totalInterest = 0;

  for (const row of schedule) {
    totalPrincipal += row.principalPaid;
    totalInterest += row.interest;

    const _html = html`
      <tr>
        <td>${row.month}</td>
        <td>${rupeeFormatter.format(row.principalPaid)}</td>
        <td>${rupeeFormatter.format(row.interest)}</td>
        <td>${rupeeFormatter.format(row.balance)}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', _html);
  }

  const last = schedule[schedule.length - 1];
  const totalPayment = totalPrincipal + totalInterest;

  elLastMonth.textContent = last.month;
  elMonths.textContent = schedule.length;
  elMonthly.textContent = rupeeFormatter.format(monthlyPayment);
  elPrincipal.textContent = rupeeFormatter.format(totalPrincipal);
  elInterest.textContent = rupeeFormatter.format(totalInterest);
  elTotal.textContent = rupeeFormatter.format(totalPayment);
}

function initializeThemeToggle() {
  const themeToggle = document.querySelector('#theme-toggle');

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    const isDark = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
