let principalInput = document.querySelector('#principal-input');
let interestRateInput = document.querySelector('#interest-rate-input');
let monthlyPaymentInput = document.querySelector('#monthly-payment-input');
let includeCurrentMonthCheckbox = document.querySelector('#include-current-month-checkbox');

let summaryLastMonthEl = document.querySelector('#summary-last-month');
let summaryMonthsEl = document.querySelector('#summary-months');
let summaryMonthlyEl = document.querySelector('#summary-monthly');
let summaryPrincipalEl = document.querySelector('#summary-principal');
let summaryInterestEl = document.querySelector('#summary-interest');
let summaryTotalEl = document.querySelector('#summary-total');

principalInput.addEventListener('input', calculateLoan);
interestRateInput.addEventListener('input', calculateLoan);
monthlyPaymentInput.addEventListener('input', calculateLoan);
includeCurrentMonthCheckbox.addEventListener('change', calculateLoan);

calculateLoan();

function calculateLoan() {
  console.log('calculateLoan is running...');

  let principal = parseFloat(principalInput.value);
  let interestRate = parseFloat(interestRateInput.value) / 100 / 12; // [0-100] % p.a. -> [0-1] monthly rate
  let monthlyPayment = parseFloat(monthlyPaymentInput.value);

  if (!(principal > 0 && interestRate >= 0 && monthlyPayment > 0)) {
    console.warn('Invalid inputs');
    return;
  }

  let balance = principal;
  let monthsCount = 0;

  while (balance > 0) {
    let interestPaid = balance * interestRate;
    let principalPaid = monthlyPayment - interestPaid;

    if (principalPaid <= 0) {
      console.warn('Loan can never be paid: principalPaid <= 0', { interestPaid, principalPaid });
      return;
    }

    balance -= principalPaid;
    monthsCount += 1;
    console.log(interestPaid, principalPaid, balance);
  }

  console.log({ monthsCount });

  let date = new Date();
  date.setMonth(date.getMonth() + monthsCount - parseInt(includeCurrentMonthCheckbox.checked)); // checked = 1/0
  summaryLastMonthEl.textContent = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
  });

  let totalPayment = monthlyPayment * monthsCount + balance; // balance <= 0

  summaryMonthsEl.textContent = monthsCount;
  summaryMonthlyEl.textContent = monthlyPayment;
  summaryPrincipalEl.textContent = principal;
  summaryInterestEl.textContent = totalPayment - principal;
  summaryTotalEl.textContent = totalPayment;
}
