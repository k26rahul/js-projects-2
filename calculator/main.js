let expression = '';
let resultInput = document.querySelector('#result');
let symbols = ['+', '-', '*', '/', '.'];

function append(token) {
  if (symbols.includes(token)) {
    let last = expression[expression.length - 1];
    if (symbols.includes(last)) {
      if (token != '.' || last == '.') deleteLast();
    }
  }

  expression += token;
  resultInput.value = expression;
}

function displayResult() {
  if (expression == '') return;

  let result;
  try {
    result = eval(expression);
    if (result == Infinity) {
      expression = '';
    } else {
      expression = String(result);
    }
  } catch {
    result = 'ERROR!';
    expression = '';
  }
  resultInput.value = result;
}

function allClear() {
  expression = '';
  resultInput.value = expression;
}

function deleteLast() {
  expression = expression.slice(0, expression.length - 1);
  resultInput.value = expression;
}
