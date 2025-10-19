const html = String.raw;

const principalInput = document.querySelector('#principal-input');
const interestRateInput = document.querySelector('#interest-rate-input');
const monthlyPaymentInput = document.querySelector('#monthly-payment-input');
const durationSelect = document.querySelector('#duration-select');
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
durationSelect.addEventListener('change', calculateLoan);
includeCurrentMonthCheckbox.addEventListener('change', calculateLoan);

document.querySelectorAll('input[name="calculationMode"]').forEach(radio => {
  radio.addEventListener('change', () => {
    let show = radio.value;
    let hide = radio.value == 'fixedPayment' ? 'fixedDuration' : 'fixedPayment';
    document.querySelector(`label[data-${show}`).classList.remove('hidden');
    document.querySelector(`label[data-${hide}`).classList.add('hidden');
    calculateLoan();
  });
});

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

calculateLoan();

function calculateLoan() {
  resetUI();

  let principal = parseFloat(principalInput.value);
  let interestRate = parseFloat(interestRateInput.value) / 100 / 12; // [0-100] % p.a. -> [0-1] monthly rate
  let monthlyPayment = parseFloat(monthlyPaymentInput.value);
  let duration = parseFloat(durationSelect.value);
  let calculationMode = document.querySelector('input[name="calculationMode"]:checked').value;

  if (!(principal > 0 && interestRate >= 0 && monthlyPayment > 0)) {
    errorMessageEl.textContent = 'Invalid inputs';
    errorMessageEl.hidden = false;
    return;
  }

  if (calculationMode == 'fixedDuration') {
    if (interestRate == 0) {
      monthlyPayment = principal / duration;
    } else {
      // EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]. In this formula, P is the principal loan amount, R is the monthly interest rate (annual rate divided by 12), and N is the loan tenure in months.
      let P = principal;
      let R = interestRate;
      let N = duration;
      monthlyPayment = (P * R * (1 + R) ** N) / ((1 + R) ** N - 1);

      if (Number.isNaN(monthlyPayment)) {
        // possibly due to (1+R)^N being Infinity
        errorMessageEl.textContent = 'Calculation failed. Decrease duration or interest rate.';
        errorMessageEl.hidden = false;
        return;
      }

      if (monthlyPayment - principal * interestRate < 0.01) {
        // ensure monthlyPayment > interest per month
        // otherwise, the balance will never reduce
        monthlyPayment += 0.01;
      }
    }
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
    balance = balance > 0 && balance < 0.01 ? 0 : balance;
    monthsCount += 1;

    updateTable({
      monthsCount,
      interestPaid,
      principalPaid,
      balance,
    });
  }

  if (calculationMode == 'fixedDuration' && monthsCount < duration) {
    errorMessageEl.textContent = `Not possible to extend your EMI over ${duration} months.`;
    errorMessageEl.hidden = false;
  }

  updateSummary({
    monthsCount,
    monthlyPayment,
    principal,
    balance,
  });
}

function resetUI() {
  errorMessageEl.hidden = true;
  document.querySelector('tbody').innerHTML = '';

  summaryLastMonthEl.textContent = '—';
  summaryMonthsEl.textContent = '—';
  summaryMonthlyEl.textContent = '—';
  summaryPrincipalEl.textContent = '—';
  summaryInterestEl.textContent = '—';
  summaryTotalEl.textContent = '—';
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
