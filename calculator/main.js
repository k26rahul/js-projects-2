let expression = '';

function append(value) {
  expression += value;
}

function displayResult() {
  let result = eval(expression);
  let resultDiv = document.querySelector('#result');
  resultDiv.innerText = result;
}
