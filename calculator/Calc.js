(function () {
  const expressionEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');
  const buttons = document.querySelectorAll('.btn');

  let expression = '';   // raw expression being built, e.g. "12+4*"
  let justEvaluated = false;

  const OPERATORS = new Set(['+', '-', '*', '/']);

  function displaySymbol(token) {
    if (token === '*') return '×';
    if (token === '/') return '÷';
    if (token === '-') return '−';
    return token;
  }

  function render() {
    expressionEl.textContent = expression
      .split('')
      .map(ch => (OPERATORS.has(ch) ? ' ' + displaySymbol(ch) + ' ' : ch))
      .join('');
    resultEl.classList.remove('error');
    resultEl.textContent = expression === '' ? '0' : liveValueOrLast();
  }

  // Shows the live evaluated result under the expression when possible,
  // otherwise just echoes the trailing number being typed.
  function liveValueOrLast() {
    const trimmed = expression.replace(/[+\-*/.]+$/, '');
    if (trimmed === '') return expression || '0';
    try {
      const value = safeEvaluate(trimmed);
      return formatNumber(value);
    } catch (e) {
      return expression;
    }
  }

  function safeEvaluate(expr) {
    if (!/^[0-9+\-*/.]+$/.test(expr)) throw new Error('Invalid characters');
    // eslint-disable-next-line no-new-func
    const value = Function('"use strict"; return (' + expr + ')')();
    if (typeof value !== 'number' || !isFinite(value)) throw new Error('Math error');
    return value;
  }

  function formatNumber(n) {
    if (Number.isInteger(n)) return n.toString();
    return parseFloat(n.toFixed(10)).toString();
  }

  function appendValue(val) {
    const isDigit = /[0-9]/.test(val);
    const isDot = val === '.';
    const isOperator = OPERATORS.has(val);

    if (justEvaluated) {
      justEvaluated = false;
      if (isOperator) {
        // continue building on the previous result
      } else {
        expression = '';
      }
    }

    const last = expression.slice(-1);

    if (isOperator) {
      if (expression === '' && val !== '-') return; // no leading operator except minus
      if (OPERATORS.has(last)) {
        expression = expression.slice(0, -1) + val; // replace trailing operator
      } else {
        expression += val;
      }
    } else if (isDot) {
      const segment = expression.split(/[+\-*/]/).pop();
      if (segment.includes('.')) return;
      expression += segment === '' ? '0.' : '.';
    } else if (isDigit) {
      expression += val;
    }

    render();
  }

  function clearAll() {
    expression = '';
    justEvaluated = false;
    render();
  }

  function deleteChar() {
    if (justEvaluated) {
      clearAll();
      return;
    }
    expression = expression.slice(0, -1);
    render();
  }

  function percent() {
    const segment = expression.split(/[+\-*/]/).pop();
    if (segment === '') return;
    try {
      const value = safeEvaluate(segment) / 100;
      expression = expression.slice(0, expression.length - segment.length) + formatNumber(value);
      render();
    } catch (e) { /* ignore invalid segment */ }
  }

  function equals() {
    if (expression === '') return;
    const cleanExpr = expression.replace(/[+\-*/.]+$/, '');
    try {
      const value = safeEvaluate(cleanExpr);
      expressionEl.textContent = cleanExpr
        .split('')
        .map(ch => (OPERATORS.has(ch) ? ' ' + displaySymbol(ch) + ' ' : ch))
        .join('') + ' =';
      resultEl.classList.remove('error');
      resultEl.textContent = formatNumber(value);
      expression = formatNumber(value);
      justEvaluated = true;
    } catch (e) {
      resultEl.classList.add('error');
      resultEl.textContent = e.message === 'Math error' ? 'Cannot divide by 0' : 'Error';
      justEvaluated = false;
      expression = '';
    }
  }

  function flashButton(btn) {
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 90);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      flashButton(btn);
      if (action === 'clear') clearAll();
      else if (action === 'delete') deleteChar();
      else if (action === 'percent') percent();
      else if (action === 'equals') equals();
      else if (value !== undefined) appendValue(value);
    });
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    let btn = null;

    if (/[0-9.]/.test(key)) {
      btn = [...buttons].find(b => b.dataset.value === key);
      appendValue(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      btn = [...buttons].find(b => b.dataset.value === key);
      appendValue(key);
    } else if (key === 'Enter' || key === '=') {
      btn = [...buttons].find(b => b.dataset.action === 'equals');
      equals();
    } else if (key === 'Backspace') {
      btn = [...buttons].find(b => b.dataset.action === 'delete');
      deleteChar();
    } else if (key === 'Escape') {
      btn = [...buttons].find(b => b.dataset.action === 'clear');
      clearAll();
    } else if (key === '%') {
      btn = [...buttons].find(b => b.dataset.action === 'percent');
      percent();
    } else {
      return;
    }

    e.preventDefault();
    if (btn) flashButton(btn);
  });

  render();
})();