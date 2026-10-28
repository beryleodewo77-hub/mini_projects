
// ===== Constants =====
const ROWS = 6;
const COLS = 7;
const EMPTY = 0;

// ===== State =====
let board = createBoard();
let currentPlayer = 1;
let winResult = null;
let status = 'playing'; // 'playing' | 'won' | 'draw'
let scores = { 1: 0, 2: 0 };
let draws = 0;
let mode = 'pvp'; // 'pvp' | 'ai'
let previewCol = null;
let aiThinking = false;
let aiDepth = 4;
let round = 1;

// ===== DOM =====
const boardEl = document.getElementById('board');
const indicatorsEl = document.getElementById('columnIndicators');
const statusTextEl = document.getElementById('statusText');
const statusDotEl = document.getElementById('statusDot');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const label1El = document.getElementById('label1');
const label2El = document.getElementById('label2');
const scoreCard1El = document.getElementById('scoreCard1');
const scoreCard2El = document.getElementById('scoreCard2');
const resetBtn = document.getElementById('resetBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const newMatchBtn = document.getElementById('newMatchBtn');
const modeToggle = document.getElementById('modeToggle');
const difficultyToggle = document.getElementById('difficultyToggle');
const roundInfoEl = document.getElementById('roundInfo');
const drawInfoEl = document.getElementById('drawInfo');

// ===== Game logic =====

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

function getLowestEmptyRow(b, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (b[r][col] === EMPTY) return r;
  }
  return -1;
}

function dropPiece(b, col, player) {
  const row = getLowestEmptyRow(b, col);
  if (row === -1) return null;
  const nb = b.map((r) => [...r]);
  nb[row][col] = player;
  return { board: nb, row };
}

function checkWin(b, row, col) {
  const player = b[row][col];
  if (!player) return null;

  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    const line = [[row, col]];
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && b[r][c] === player) {
      line.push([r, c]);
      r += dr; c += dc;
    }
    r = row - dr; c = col - dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && b[r][c] === player) {
      line.unshift([r, c]);
      r -= dr; c -= dc;
    }
    if (line.length >= 4) return { winner: player, cells: line.slice(0, 4) };
  }
  return null;
}

function isBoardFull(b) {
  return b[0].every((c) => c !== EMPTY);
}

function getValidMoves(b) {
  const moves = [];
  for (let c = 0; c < COLS; c++) {
    if (getLowestEmptyRow(b, c) !== -1) moves.push(c);
  }
  return moves;
}

// ===== AI (minimax with alpha-beta) =====

function getAIMove(b, aiPlayer, depth) {
  const human = aiPlayer === 1 ? 2 : 1;
  const valid = getValidMoves(b);
  if (valid.length === 0) return -1;

  let bestScore = -Infinity;
  let bestMoves = [];
  for (const col of valid) {
    const res = dropPiece(b, col, aiPlayer);
    const win = checkWin(res.board, res.row, col);
    const score = win ? 1000000 : minimax(res.board, depth - 1, -Infinity, Infinity, false, aiPlayer, human);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [col];
    } else if (score === bestScore) {
      bestMoves.push(col);
    }
  }
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function minimax(b, depth, alpha, beta, maximizing, aiPlayer, human) {
  const valid = getValidMoves(b);
  if (depth === 0 || valid.length === 0) return evaluateBoard(b, aiPlayer, human);

  if (maximizing) {
    let value = -Infinity;
    for (const col of valid) {
      const res = dropPiece(b, col, aiPlayer);
      const win = checkWin(res.board, res.row, col);
      if (win) return 1000000 - (7 - depth);
      value = Math.max(value, minimax(res.board, depth - 1, alpha, beta, false, aiPlayer, human));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const col of valid) {
      const res = dropPiece(b, col, human);
      const win = checkWin(res.board, res.row, col);
      if (win) return -1000000 + (7 - depth);
      value = Math.min(value, minimax(res.board, depth - 1, alpha, beta, true, aiPlayer, human));
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}

function evaluateBoard(b, ai, human) {
  let score = 0;
  for (let r = 0; r < ROWS; r++) {
    if (b[r][3] === ai) score += 3;
  }
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of dirs) {
        const window = [];
        for (let i = 0; i < 4; i++) {
          const rr = r + dr * i, cc = c + dc * i;
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) { window.length = 0; break; }
          window.push(b[rr][cc]);
        }
        if (window.length === 4) score += scoreWindow(window, ai, human);
      }
    }
  }
  return score;
}

function scoreWindow(window, ai, human) {
  const aiCount = window.filter((c) => c === ai).length;
  const humanCount = window.filter((c) => c === human).length;
  const emptyCount = window.filter((c) => c === EMPTY).length;
  if (aiCount > 0 && humanCount > 0) return 0;
  if (aiCount === 4) return 100;
  if (aiCount === 3 && emptyCount === 1) return 10;
  if (aiCount === 2 && emptyCount === 2) return 3;
  if (humanCount === 3 && emptyCount === 1) return -15;
  if (humanCount === 2 && emptyCount === 2) return -2;
  return 0;
}

// ===== Rendering =====

function buildBoard() {
  boardEl.innerHTML = '';
  indicatorsEl.innerHTML = '';

  for (let c = 0; c < COLS; c++) {
    const indicator = document.createElement('div');
    indicator.className = 'col-indicator';
    indicator.dataset.col = c;
    indicatorsEl.appendChild(indicator);

    const colBtn = document.createElement('button');
    colBtn.className = 'column';
    colBtn.dataset.col = c;
    colBtn.setAttribute('aria-label', `Drop piece in column ${c + 1}`);

    colBtn.addEventListener('click', () => handleColumnClick(c));
    colBtn.addEventListener('mouseenter', () => handleHover(c));
    colBtn.addEventListener('mouseleave', () => handleHover(null));

    for (let r = 0; r < ROWS; r++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      colBtn.appendChild(cell);
    }
    boardEl.appendChild(colBtn);
  }
}

function render() {
  const winCells = new Set();
  if (winResult) {
    winResult.cells.forEach(([r, c]) => winCells.add(`${r}-${c}`));
  }

  // Clear all cells
  document.querySelectorAll('.cell').forEach((cell) => {
    cell.innerHTML = '';
  });

  // Render pieces
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = boardEl.children[c]?.children[r];
      if (!cell) continue;
      const val = board[r][c];
      if (val) {
        const piece = document.createElement('div');
        piece.className = `piece piece-p${val}`;
        if (winCells.has(`${r}-${c}`)) piece.classList.add('winning');
        piece.style.animationDelay = `${(ROWS - r) * 0.04}s`;
        cell.appendChild(piece);
      }
    }
  }

  // Render preview
  if (previewCol !== null && status === 'playing' && !isBoardDisabled()) {
    const previewRow = getLowestEmptyRow(board, previewCol);
    if (previewRow !== -1) {
      const cell = boardEl.children[previewCol]?.children[previewRow];
      if (cell && !board[previewRow][previewCol]) {
        const preview = document.createElement('div');
        preview.className = `preview preview-p${currentPlayer}`;
        cell.appendChild(preview);
      }
    }
  }

  // Column indicators
  document.querySelectorAll('.col-indicator').forEach((ind) => {
    ind.classList.remove('preview-p1', 'preview-p2');
    const c = parseInt(ind.dataset.col, 10);
    if (c === previewCol && !isBoardDisabled()) {
      ind.classList.add(`preview-p${currentPlayer}`);
    }
  });

  // Status
  statusTextEl.classList.remove('p1', 'p2');
  statusDotEl.classList.remove('active-p1', 'active-p2');

  if (status === 'won' && winResult) {
    const name = mode === 'ai' ? (winResult.winner === 1 ? 'You' : 'AI') : `Player ${winResult.winner}`;
    statusTextEl.textContent = `${name} wins!`;
  } else if (status === 'draw') {
    statusTextEl.textContent = "It's a draw!";
  } else if (aiThinking) {
    statusTextEl.textContent = 'AI is thinking...';
  } else if (mode === 'ai') {
    statusTextEl.textContent = currentPlayer === 1 ? 'Your turn' : 'AI turn';
    statusDotEl.classList.add(`active-p${currentPlayer}`);
    statusTextEl.classList.add(`p${currentPlayer}`);
  } else {
    statusTextEl.textContent = `Player ${currentPlayer}'s turn`;
    statusDotEl.classList.add(`active-p${currentPlayer}`);
    statusTextEl.classList.add(`p${currentPlayer}`);
  }

  // Scoreboard
  score1El.textContent = scores[1];
  score2El.textContent = scores[2];
  label1El.textContent = mode === 'ai' ? 'You' : 'Player 1';
  label2El.textContent = mode === 'ai' ? 'AI' : 'Player 2';

  scoreCard1El.classList.toggle('active', status === 'playing' && currentPlayer === 1);
  scoreCard2El.classList.toggle('active', status === 'playing' && currentPlayer === 2);

  // Round info
  roundInfoEl.textContent = `Round ${round}`;
  drawInfoEl.textContent = `Draws: ${draws}`;
  drawInfoEl.hidden = draws === 0;

  // Next round button
  nextRoundBtn.hidden = status === 'playing';

  // Disable columns
  document.querySelectorAll('.column').forEach((col) => {
    col.disabled = isBoardDisabled();
  });
}

// ===== Interaction =====

function isBoardDisabled() {
  return status !== 'playing' || (mode === 'ai' && currentPlayer === 2) || aiThinking;
}

function handleColumnClick(col) {
  if (status !== 'playing') return;
  if (mode === 'ai' && currentPlayer === 2) return;
  if (aiThinking) return;

  const res = dropPiece(board, col, currentPlayer);
  if (!res) return;

  board = res.board;
  const win = checkWin(board, res.row, col);
  if (win) {
    winResult = win;
    status = 'won';
    scores[win.winner]++;
    render();
    return;
  }
  if (isBoardFull(board)) {
    status = 'draw';
    draws++;
    render();
    return;
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  render();
  maybeAITurn();
}

function handleHover(col) {
  previewCol = col;
  render();
}

function resetGame(keepScores) {
  board = createBoard();
  currentPlayer = 1;
  winResult = null;
  status = 'playing';
  aiThinking = false;
  previewCol = null;
  if (!keepScores) {
    scores = { 1: 0, 2: 0 };
    draws = 0;
    round = 1;
  }
  render();
}

// ===== AI turn =====

function maybeAITurn() {
  if (mode !== 'ai' || currentPlayer !== 2 || status !== 'playing') return;
  aiThinking = true;
  render();

  setTimeout(() => {
    const col = getAIMove(board, 2, aiDepth);
    if (col === -1) {
      aiThinking = false;
      render();
      return;
    }
    const res = dropPiece(board, col, 2);
    if (!res) {
      aiThinking = false;
      render();
      return;
    }
    board = res.board;
    const win = checkWin(board, res.row, col);
    if (win) {
      winResult = win;
      status = 'won';
      scores[2]++;
    } else if (isBoardFull(board)) {
      status = 'draw';
      draws++;
    } else {
      currentPlayer = 1;
    }
    aiThinking = false;
    render();
  }, 500);
}

// ===== Event listeners =====

resetBtn.addEventListener('click', () => resetGame(true));

nextRoundBtn.addEventListener('click', () => {
  round++;
  resetGame(true);
});

newMatchBtn.addEventListener('click', () => resetGame(false));

modeToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  const newMode = btn.dataset.mode;
  if (newMode === mode) return;
  mode = newMode;
  modeToggle.querySelectorAll('.toggle-btn').forEach((b) => b.classList.toggle('active', b === btn));
  difficultyToggle.hidden = mode !== 'ai';
  resetGame(false);
});

difficultyToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('.toggle-btn');
  if (!btn) return;
  aiDepth = parseInt(btn.dataset.depth, 10);
  difficultyToggle.querySelectorAll('.toggle-btn').forEach((b) => b.classList.toggle('active', b === btn));
});

// ===== Init =====
buildBoard();
render();
