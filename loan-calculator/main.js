initializeThemeToggle();

function initializeThemeToggle() {
  const themeToggle = document.querySelector('#theme-toggle');

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    const isDark = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

const form = document.querySelector('.loan-form');
const tbody = document.querySelector('.loan-schedule tbody');
const errorEl = document.querySelector('#summary-error');

// helper to show or clear error
function showError(message) {
  if (message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  } else {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }
}

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function updateLoanCalculation() {
  const data = new FormData(form);
  const principal = parseFloat(data.get('principal'));
  const annualRate = parseFloat(data.get('rate'));
  const payment = parseFloat(data.get('payment'));
  const includeCurrent = data.get('includeCurrent') === 'on';

  // basic validation
  if (!principal || !annualRate || !payment) {
    renderSchedule([]);
    return;
  }

  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;

  let date = new Date();
  if (!includeCurrent) {
    date.setMonth(date.getMonth() + 1);
  }

  const schedule = [];
  let monthCount = 0;

  // quick impossible-loan check
  const firstInterest = balance * monthlyRate;
  if (payment <= firstInterest) {
    showError('Monthly payment will never pay off the loan. Increase the payment.');
    renderSchedule([]);
    return;
  }

  // compute amortization
  while (balance > 0) {
    monthCount++;

    const interest = balance * monthlyRate;
    let principalPaid = payment - interest;

    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    if (balance < 1) balance = 0;

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

  renderSchedule(schedule);
}

function renderSchedule(schedule) {
  // cache DOM nodes once at the top
  const elLastMonth = document.querySelector('#summary-last-month');
  const elMonths = document.querySelector('#summary-months');
  const elPrincipal = document.querySelector('#summary-principal');
  const elInterest = document.querySelector('#summary-interest');
  const elTotal = document.querySelector('#summary-total');

  // clear previous table content
  tbody.innerHTML = '';

  // always reset summary fields to dashes
  elLastMonth.textContent = '—';
  elMonths.textContent = '—';
  elPrincipal.textContent = '—';
  elInterest.textContent = '—';
  elTotal.textContent = '—';

  // if schedule is empty (e.g., invalid input), stop here
  if (schedule.length === 0) return;

  // otherwise, fill table and summary values
  let totalPrincipal = 0;
  let totalInterest = 0;

  for (const row of schedule) {
    totalPrincipal += row.principalPaid;
    totalInterest += row.interest;

    const html = `
      <tr>
        <td>${row.month}</td>
        <td>${rupeeFormatter.format(row.principalPaid)}</td>
        <td>${rupeeFormatter.format(row.interest)}</td>
        <td>${rupeeFormatter.format(row.balance)}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', html);
  }

  const last = schedule[schedule.length - 1];

  elLastMonth.textContent = last.month;
  elMonths.textContent = schedule.length;
  elPrincipal.textContent = rupeeFormatter.format(totalPrincipal);
  elInterest.textContent = rupeeFormatter.format(totalInterest);

  const totalPayment = totalPrincipal + totalInterest;
  elTotal.textContent = rupeeFormatter.format(totalPayment);
}

const inputs = form.querySelectorAll('input');

inputs.forEach(input => {
  const eventName = input.type === 'checkbox' ? 'change' : 'input';
  input.addEventListener(eventName, updateLoanCalculation);
});

updateLoanCalculation(); // initial render
