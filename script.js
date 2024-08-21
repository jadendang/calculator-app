window.onload = function () {
  const inputBox = document.getElementById("input");
  const expressionDiv = document.getElementById("expression");
  const resultDiv = document.getElementById("result");

  // Define expression and result variables
  let expression = "";
  let result = "";

  // Define button clicks
  function buttonClick(event) {
    const target = event.target;
    const action = target.dataset.action;
    const value = target.dataset.value;
    // console.log(target, action, value);

    // Switch case for calculator control
    switch (action) {
      case "number":
        addValue(value);
        break;
      case "clear":
        clear();
        break;
      case "backspace":
        backspace();
        break;
      case "addition":
      case "subtraction":
      case "multiplication":
      case "division":
        if (expression === "" && value !== "") {
          startFromResult(value);
        } else if (expression !== "" && !isLastCharOperator()) {
          addValue(value);
        }
        break;
      case "submit":
        submit();
        break;
      case "negate":
        negate();
        break;
      case "mod":
        percentage();
        break;
      case "decimal":
        decimal(value);
        break;
    }

    updateDisplay(expression, result);
  }

  inputBox.addEventListener("click", buttonClick);

  function addValue(value) {
    if (value === ".") {
      // Finds the index of the last operator in the expression
      const lastOperatorIndex = expression.search(/[+\-*/]/);
      // Checks if the last operator is a decimal point
      const lastDecimalIndex = expression.lastIndexOf(".");
      // Find the index of the last number in the expression
      const lastNumberIndex = Math.max(
        expression.lastIndexOf("+"),
        expression.lastIndexOf("-"),
        expression.lastIndexOf("*"),
        expression.lastIndexOf("/")
      );
      // Checks if decimal present or if expression is empty
      if (
        (lastDecimalIndex < lastOperatorIndex ||
          lastDecimalIndex < lastNumberIndex ||
          lastDecimalIndex === -1) &&
        (expression === "" ||
          expression.slice(lastNumberIndex + 1).indexOf("-") === -1)
      ) {
        expression += value;
      }
    } else {
      expression += value;
    }
  }

  function updateDisplay(expression, result) {
    expressionDiv.textContent = expression;
    resultDiv.textContent = result;
  }

  function clear() {
    expression = "";
    result = "";
  }

  function backspace() {
    expression = expression.slice(0, -1);
  }

  function isLastCharOperator() {
    return isNaN(parseInt(expression.slice(-1)));
  }

  function startFromResult(value) {
    expression += result + value;
  }

  function submit() {
    result = evaluateExpression();
    expression = "";
  }

  function evaluateExpression() {
    const evalResult = eval(expression);
    // Checks if evalResult isNan or infinite. If it is, return a space character ' '
    return isNaN(evalResult) || !isFinite(evalResult)
      ? " "
      : evalResult < 1
      ? parseFloat(evalResult.toFixed(10))
      : parseFloat(evalResult.toFixed(2));
  }

  function negate() {
    // If expression is empty, negate result
    if (expression === "" && result !== "") {
      result = -result;
    } else if (!expression.startsWith("-") && expression !== "") {
      expression = "-" + expression;
      // If expression starts with '-', remove it
    } else if (expression.startsWith("-")) {
      expression = expression.slice(1);
    }
  }

  function percentage() {
    // If expression is empty, percentage result
    if (expression !== "") {
      result = evaluateExpression();
      expression = "";
      if (!isNaN(result) && isFinite(result)) {
        result /= 100;
      } else {
        result = "";
      }
    } else if (result !== "") {
      result = parseFloat(result) / 100;
    }
  }

  function decimal(value) {
    if (!expression.endsWith(".") && !isNaN(expression.slice(-1))) {
      addValue(value);
    }
  }
};
