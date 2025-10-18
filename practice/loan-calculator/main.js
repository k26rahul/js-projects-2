const html = String.raw;

const principalInput = document.querySelector('#principal-input');
const interestRateInput = document.querySelector('#interest-rate-input');
const monthlyPaymentInput = document.querySelector('#monthly-payment-input');
const includeCurrentMonthCheckbox = document.querySelector('#include-current-month-checkbox');

const errorMessageEl = document.querySelector('#error-message');
const summaryLastMonthEl = document.querySelector('#summary-last-month');
const summaryMonthsEl = document.querySelector('#summary-months');
const summaryMonthlyEl = document.querySelector('#summary-monthly');
const summaryPrincipalEl = document.querySelector('#summary-principal');
const summaryInterestEl = document.querySelector('#summary-interest');
const summaryTotalEl = document.querySelector('#summary-total');

principalInput.addEventListener('input', calculateLoan);
interestRateInput.addEventListener('input', calculateLoan);
monthlyPaymentInput.addEventListener('input', calculateLoan);
includeCurrentMonthCheckbox.addEventListener('change', calculateLoan);

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

calculateLoan();

function calculateLoan() {
  errorMessageEl.hidden = true;
  document.querySelector('tbody').innerHTML = '';

  summaryLastMonthEl.textContent = '—';
  summaryMonthsEl.textContent = '—';
  summaryMonthlyEl.textContent = '—';
  summaryPrincipalEl.textContent = '—';
  summaryInterestEl.textContent = '—';
  summaryTotalEl.textContent = '—';

  let principal = parseFloat(principalInput.value);
  let interestRate = parseFloat(interestRateInput.value) / 100 / 12; // [0-100] % p.a. -> [0-1] monthly rate
  let monthlyPayment = parseFloat(monthlyPaymentInput.value);

  if (!(principal > 0 && interestRate >= 0 && monthlyPayment > 0)) {
    errorMessageEl.textContent = 'Invalid inputs';
    errorMessageEl.hidden = false;
    return;
  }

  let balance = principal;
  let monthsCount = 0;

  while (balance > 0) {
    let interestPaid = balance * interestRate;
    let principalPaid = monthlyPayment - interestPaid;

    if (principalPaid <= 0) {
      errorMessageEl.textContent =
        'Monthly payment will never pay off the loan. Increase the payment.';
      errorMessageEl.hidden = false;
      return;
    }

    balance -= principalPaid;
    monthsCount += 1;

    updateTable({
      monthsCount,
      interestPaid,
      principalPaid,
      balance,
    });
  }

  updateSummary({
    monthsCount,
    monthlyPayment,
    principal,
    balance,
  });
}

function updateTable({ monthsCount, interestPaid, principalPaid, balance }) {
  let date = new Date();
  date.setMonth(date.getMonth() + monthsCount - includeCurrentMonthCheckbox.checked); // checked = 1/0

  let formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
  });

  if (balance <= 0) {
    principalPaid += balance;
    balance = 0;
  }

  let template = html`
    <tr>
      <td>${formattedDate}</td>
      <td>${rupeeFormatter.format(principalPaid)}</td>
      <td>${rupeeFormatter.format(interestPaid)}</td>
      <td>${rupeeFormatter.format(balance)}</td>
    </tr>
  `;

  document.querySelector('tbody').innerHTML += template;
}

function updateSummary({ monthsCount, monthlyPayment, balance, principal }) {
  let date = new Date();
  date.setMonth(date.getMonth() + monthsCount - includeCurrentMonthCheckbox.checked); // checked = 1/0

  let formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
  });

  let totalPayment = monthlyPayment * monthsCount + balance; // balance <= 0

  summaryLastMonthEl.textContent = formattedDate;
  summaryMonthsEl.textContent = monthsCount;
  summaryMonthlyEl.textContent = rupeeFormatter.format(monthlyPayment);
  summaryPrincipalEl.textContent = rupeeFormatter.format(principal);
  summaryInterestEl.textContent = rupeeFormatter.format(totalPayment - principal);
  summaryTotalEl.textContent = rupeeFormatter.format(totalPayment);
}
