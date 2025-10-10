let resultInput = document.querySelector('#result');
let symbols = ['+', '-', '*', '/', '.'];
let expression = '';

function append(newToken) {
  // Check if the new token entered is a symbol (like +, -, *, /, or .)
  if (symbols.includes(newToken)) {
    // Get the last token that was already added to the expression
    let lastToken = expression[expression.length - 1];

    // Check if the last token is also a symbol
    // → This means we have two symbols in a row (like ++, +., .+, etc.)
    if (symbols.includes(lastToken)) {
      // Handle different combinations of two consecutive symbols:
      // ----------------------------------------------------------
      // Case 1: .+   → remove last (because '.' followed by symbol is invalid)
      // Case 2: ++   → remove last (because two operators in a row is invalid)
      // Case 3: +.   → keep (allowed, means decimal point after operator)
      // ----------------------------------------------------------

      // Delete the last symbol if:
      //  - The last token was a '.' (dot)   OR
      //  - The new token is NOT a '.' (any operator like +, -, etc.)
      if (lastToken == '.' || newToken != '.') {
        deleteLast();
      }
    }
  }

  // Add the new token to the expression
  expression += newToken;

  // Update the display (input field) to show the current expression
  resultInput.value = expression;
}

function displayResult() {
  // If there is no expression to evaluate, do nothing and exit the function
  if (expression == '') return;

  let result;
  try {
    // Try to evaluate the current expression (like "2+3*4")
    result = eval(expression);

    // Check if result is Infinity (for example, when dividing by zero)
    if (result == Infinity) {
      // Clear the expression (invalid mathematical result)
      expression = '';
    } else {
      // Convert the numeric result to a string
      // so it can be displayed or used in further operations
      expression = String(result);
    }
  } catch {
    // If eval() throws an error (invalid expression, syntax error, etc.)
    // show "ERROR!" and clear the expression
    result = 'ERROR!';
    expression = '';
  }

  // Update the display with the final result or error message
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
