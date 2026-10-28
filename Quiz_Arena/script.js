// ==================== QuizArena — Pure JavaScript ====================

// ---------- Supabase Setup ----------
let supabase = null;
try {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn('Supabase could not be initialized — leaderboard features will be unavailable.');
}

// ---------- Question Data ----------
const CATEGORIES = [
    {
        id: 'web-dev',
        name: 'Web Development',
        icon: '⌘',
        description: 'HTML, CSS, JavaScript & modern frameworks',
        questions: {
            easy: [
                { id: 1, question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctIndex: 0, explanation: 'HTML stands for HyperText Markup Language, the standard markup language for web pages.' },
                { id: 2, question: 'Which CSS property controls text size?', options: ['font-style', 'text-size', 'font-size', 'text-style'], correctIndex: 2, explanation: 'The font-size property controls the size of text in CSS.' },
                { id: 3, question: 'What is the correct way to declare a JavaScript variable that can change?', options: ['const x = 5;', 'let x = 5;', 'fixed x = 5;', 'var x = 5;'], correctIndex: 1, explanation: 'let declares a block-scoped variable that can be reassigned. const cannot be reassigned.' },
                { id: 4, question: 'Which HTML tag creates the largest heading?', options: ['<h6>', '<head>', '<heading>', '<h1>'], correctIndex: 3, explanation: '<h1> creates the largest heading in HTML, while <h6> creates the smallest.' },
                { id: 5, question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correctIndex: 1, explanation: 'CSS stands for Cascading Style Sheets, used to style HTML elements.' },
                { id: 6, question: 'Which symbol is used for single-line comments in JavaScript?', options: ['<!-- -->', '//', '#', '/* */'], correctIndex: 1, explanation: 'Double slashes // are used for single-line comments in JavaScript.' },
                { id: 7, question: 'What is the DOM?', options: ['A type of database', 'A CSS framework', 'A programming language', 'Document Object Model'], correctIndex: 3, explanation: 'DOM stands for Document Object Model — a tree-like representation of a web page.' },
                { id: 8, question: 'Which attribute specifies alternative text for an image?', options: ['title', 'alt', 'src', 'href'], correctIndex: 1, explanation: 'The alt attribute provides alternative text for images, important for accessibility.' },
            ],
            medium: [
                { id: 1, question: 'What is the box model in CSS?', options: ['A layout framework', 'A model for how elements are sized with content, padding, border, margin', 'A JavaScript design pattern', 'A responsive design technique'], correctIndex: 1, explanation: 'The CSS box model describes how every element is a box with content, padding, border, and margin layers.' },
                { id: 2, question: 'What does "hoisting" mean in JavaScript?', options: ['Moving variables to a different file', 'Moving declarations to the top of their scope', 'Lifting elements in the DOM', 'Increasing variable values'], correctIndex: 1, explanation: 'Hoisting moves variable and function declarations to the top of their containing scope during compilation.' },
                { id: 3, question: 'Which CSS layout module is designed for one-dimensional layouts?', options: ['Grid', 'Flexbox', 'Float', 'Position'], correctIndex: 1, explanation: 'Flexbox is a one-dimensional layout module, while CSS Grid is two-dimensional.' },
                { id: 4, question: 'What is the event loop in JavaScript?', options: ['A loop that iterates over DOM events', 'A mechanism that handles async callbacks via the call stack and task queue', 'A for-loop over event listeners', 'A CSS animation cycle'], correctIndex: 1, explanation: 'The event loop is the mechanism that lets JavaScript handle async operations by processing the task queue when the call stack is empty.' },
                { id: 5, question: 'What does "use strict" do in JavaScript?', options: ['Enables strict typing', 'Enables stricter parsing and error handling', 'Disables ES6 features', 'Prevents use of external libraries'], correctIndex: 1, explanation: '"use strict" enables strict mode, which catches silent errors and prohibits some unsafe actions.' },
                { id: 6, question: 'What is the difference between == and === in JavaScript?', options: ['There is no difference', '== compares value, === compares value and type', '=== is faster', '== is deprecated'], correctIndex: 1, explanation: '== performs type coercion before comparing, while === checks both value and type without coercion.' },
                { id: 7, question: 'Which HTTP status code means "Not Found"?', options: ['200', '301', '404', '500'], correctIndex: 2, explanation: '404 is the client error status meaning the requested resource was not found.' },
                { id: 8, question: 'What is a closure in JavaScript?', options: ['A way to close a browser tab', 'A function that retains access to its outer scope variables', 'A method to close connections', 'A CSS technique'], correctIndex: 1, explanation: 'A closure is a function that preserves access to variables from its lexical scope, even after the outer function returns.' },
            ],
            hard: [
                { id: 1, question: 'What is the output of: console.log(typeof null)?', options: ['null', 'undefined', 'object', 'string'], correctIndex: 2, explanation: 'typeof null returns "object" — a well-known JavaScript bug that cannot be fixed without breaking existing code.' },
                { id: 2, question: 'What is the "prototype chain" in JavaScript?', options: ['A chain of promises', 'The mechanism for inheritance via linked prototype objects', 'A debugging tool', 'A way to chain array methods'], correctIndex: 1, explanation: 'The prototype chain is how JavaScript achieves inheritance — objects link to other objects via their __proto__ property.' },
                { id: 3, question: 'What is the difference between "throttle" and "debounce"?', options: ['They are identical', 'Throttle limits to one call per interval; debounce waits until calls stop', 'Throttle is for scrolling, debounce for clicking', 'Debounce is faster'], correctIndex: 1, explanation: 'Throttle ensures a function runs at most once per time interval. Debounce delays execution until calls stop for a specified period.' },
                { id: 4, question: 'What is a "Service Worker" in web development?', options: ['A backend server process', 'A script that runs in the background enabling offline experiences and push notifications', 'A web worker for DOM manipulation', 'A type of CSS preprocessor'], correctIndex: 1, explanation: 'A Service Worker is a background script that intercepts network requests, enabling features like offline caching and push notifications.' },
                { id: 5, question: 'What is the "Critical Rendering Path"?', options: ['A security feature', 'The sequence of steps the browser takes to convert HTML/CSS/JS into pixels on screen', 'A CSS optimization tool', 'A JavaScript rendering library'], correctIndex: 1, explanation: 'The Critical Rendering Path is the series of steps (DOM → CSSOM → Render Tree → Layout → Paint → Composite) the browser follows to render a page.' },
                { id: 6, question: 'What does "tree shaking" refer to in modern bundlers?', options: ['A data structure optimization', 'Eliminating dead (unused) code from the final bundle', 'Shaking the DOM tree for updates', 'A performance testing technique'], correctIndex: 1, explanation: 'Tree shaking is dead code elimination — bundlers analyze the import graph and remove exported code that is never imported.' },
                { id: 7, question: 'What is the "Reflow" (Layout) operation in browsers?', options: ['A CSS animation', 'Recalculating positions and geometry of elements when the layout changes', 'A JavaScript garbage collection step', 'Re-rendering pixels only'], correctIndex: 1, explanation: 'Reflow (layout) recalculates element geometry when changes affect the layout. It is expensive — repaint only updates pixels without reflow.' },
                { id: 8, question: 'What is "Hydration" in the context of SSR frameworks?', options: ['A CSS technique for responsive images', 'Attaching event listeners to server-rendered HTML to make it interactive', 'A data caching strategy', 'A way to compress JavaScript'], correctIndex: 1, explanation: 'Hydration is the process where client-side JavaScript attaches event listeners and state to server-rendered HTML, making the page interactive.' },
            ],
        },
    },
    {
        id: 'general',
        name: 'General Knowledge',
        icon: '🌍',
        description: 'Test your knowledge across the world',
        questions: {
            easy: [
                { id: 1, question: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.' },
                { id: 2, question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctIndex: 2, explanation: 'Paris has been the capital of France since the 10th century.' },
                { id: 3, question: 'What is the largest planet in our solar system?', options: ['Earth', 'Mars', 'Saturn', 'Jupiter'], correctIndex: 3, explanation: 'Jupiter is the largest planet, with a mass more than twice that of all other planets combined.' },
                { id: 4, question: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'A rainbow has 7 colors: red, orange, yellow, green, blue, indigo, and violet.' },
                { id: 5, question: 'What is the tallest animal in the world?', options: ['Elephant', 'Giraffe', 'Hippo', 'Rhinoceros'], correctIndex: 1, explanation: 'The giraffe is the tallest land animal, reaching heights of up to 5.5 meters (18 feet).' },
                { id: 6, question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3, explanation: 'The Pacific Ocean is the largest and deepest ocean, covering about 63 million square miles.' },
                { id: 7, question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctIndex: 1, explanation: 'A hexagon has 6 sides and 6 angles.' },
                { id: 8, question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Horse', 'Greyhound'], correctIndex: 1, explanation: 'The cheetah can reach speeds of up to 70 mph (112 km/h), making it the fastest land animal.' },
            ],
            medium: [
                { id: 1, question: 'Which country has the most natural lakes?', options: ['USA', 'Russia', 'Canada', 'Finland'], correctIndex: 2, explanation: 'Canada has over 2 million lakes — more than the rest of the world combined.' },
                { id: 2, question: 'What is the smallest country in the world by area?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correctIndex: 1, explanation: 'Vatican City is the smallest country at just 0.44 square kilometers.' },
                { id: 3, question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Van Gogh'], correctIndex: 2, explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1519. It is housed in the Louvre.' },
                { id: 4, question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2, explanation: 'Au comes from the Latin word "aurum," meaning gold. Ag is silver (argentum).' },
                { id: 5, question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2, explanation: "World War II ended in 1945 with Japan's surrender in September." },
                { id: 6, question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctIndex: 1, explanation: 'The Nile is generally considered the longest river at approximately 6,650 km, though some studies suggest the Amazon may be longer.' },
                { id: 7, question: 'Which element has the atomic number 1?', options: ['Helium', 'Hydrogen', 'Carbon', 'Oxygen'], correctIndex: 1, explanation: 'Hydrogen is element 1 — the lightest and most abundant element in the universe.' },
                { id: 8, question: 'What is the currency of Japan?', options: ['Won', 'Yuan', 'Yen', 'Ringgit'], correctIndex: 2, explanation: 'The Japanese Yen (JPY) is the official currency of Japan.' },
            ],
            hard: [
                { id: 1, question: 'What is the only US state that grows coffee commercially?', options: ['Florida', 'California', 'Hawaii', 'Texas'], correctIndex: 2, explanation: 'Hawaii is the only US state that grows coffee commercially, famous for Kona coffee.' },
                { id: 2, question: 'Who was the first person to break the sound barrier?', options: ['Amelia Earhart', 'Charles Yeager', 'Neil Armstrong', 'Howard Hughes'], correctIndex: 1, explanation: 'Chuck Yeager broke the sound barrier on October 14, 1947, flying a Bell X-1.' },
                { id: 3, question: 'What is the Great Barrier Reef composed of?', options: ['Coral polyps', 'Rocks', 'Algae', 'Sand'], correctIndex: 0, explanation: 'The Great Barrier Reef is built by coral polyps — tiny organisms that create calcium carbonate structures.' },
                { id: 4, question: 'Which philosopher said "I think, therefore I am"?', options: ['Plato', 'Aristotle', 'René Descartes', 'Immanuel Kant'], correctIndex: 2, explanation: 'René Descartes wrote "Cogito, ergo sum" in his 1637 work "Discourse on the Method."' },
                { id: 5, question: 'What is the most spoken language by native speakers worldwide?', options: ['English', 'Hindi', 'Mandarin Chinese', 'Spanish'], correctIndex: 2, explanation: 'Mandarin Chinese has the most native speakers — over 900 million people.' },
                { id: 6, question: 'Which country invented paper?', options: ['Egypt', 'Greece', 'China', 'India'], correctIndex: 2, explanation: 'Paper was invented in China by Cai Lun around 105 AD during the Han Dynasty.' },
                { id: 7, question: 'What is the deepest point in the ocean?', options: ['Puerto Rico Trench', 'Mariana Trench', 'Java Trench', 'Tonga Trench'], correctIndex: 1, explanation: "The Mariana Trench's Challenger Deep is the deepest known point at approximately 10,994 meters." },
                { id: 8, question: 'In which year was the Magna Carta signed?', options: ['1066', '1215', '1492', '1620'], correctIndex: 1, explanation: 'The Magna Carta was signed by King John of England on June 15, 1215.' },
            ],
        },
    },
    {
        id: 'science',
        name: 'Science',
        icon: '⚛',
        description: 'Physics, chemistry, biology & space',
        questions: {
            easy: [
                { id: 1, question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correctIndex: 2, explanation: 'Plants absorb carbon dioxide during photosynthesis and release oxygen.' },
                { id: 2, question: 'What is the chemical formula for water?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctIndex: 0, explanation: 'Water is H2O — two hydrogen atoms bonded to one oxygen atom.' },
                { id: 3, question: 'What force keeps us on the ground?', options: ['Magnetism', 'Gravity', 'Friction', 'Tension'], correctIndex: 1, explanation: 'Gravity is the force that pulls objects toward each other, keeping us on Earth.' },
                { id: 4, question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '246'], correctIndex: 1, explanation: 'The adult human body has 206 bones. Babies are born with about 300, which fuse over time.' },
                { id: 5, question: 'What is the center of an atom called?', options: ['Electron cloud', 'Nucleus', 'Shell', 'Orbit'], correctIndex: 1, explanation: 'The nucleus is the center of an atom, containing protons and neutrons.' },
                { id: 6, question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], correctIndex: 1, explanation: 'Mars is called the Red Planet due to iron oxide (rust) on its surface.' },
                { id: 7, question: "What is the human body's largest organ?", options: ['Liver', 'Brain', 'Skin', 'Lungs'], correctIndex: 2, explanation: 'Skin is the largest organ, covering an area of about 2 square meters in adults.' },
                { id: 8, question: 'What state of matter is lightning?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correctIndex: 3, explanation: 'Lightning is plasma — the fourth state of matter where gas is ionized.' },
            ],
            medium: [
                { id: 1, question: 'What is the speed of light in a vacuum?', options: ['3 × 10^5 km/s', '3 × 10^8 m/s', '3 × 10^6 m/s', '3 × 10^10 m/s'], correctIndex: 1, explanation: 'The speed of light is approximately 299,792,458 m/s — about 3 × 10^8 m/s.' },
                { id: 2, question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correctIndex: 2, explanation: 'Mitochondria generate ATP through cellular respiration, powering the cell.' },
                { id: 3, question: 'What is the pH of pure water?', options: ['0', '7', '10', '14'], correctIndex: 1, explanation: 'Pure water has a pH of 7, which is neutral on the 0–14 pH scale.' },
                { id: 4, question: 'What type of wave is a sound wave?', options: ['Transverse wave', 'Longitudinal wave', 'Electromagnetic wave', 'Standing wave'], correctIndex: 1, explanation: 'Sound waves are longitudinal waves — particles vibrate parallel to the direction of wave travel.' },
                { id: 5, question: "What is Newton's second law of motion?", options: ['F = ma', 'E = mc²', 'F = mv', 'P = mv'], correctIndex: 0, explanation: 'F = ma — force equals mass times acceleration.' },
                { id: 6, question: "What is the most abundant gas in Earth's atmosphere?", options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correctIndex: 2, explanation: "Nitrogen makes up about 78% of Earth's atmosphere, while oxygen is about 21%." },
                { id: 7, question: 'What is the chemical symbol for sodium?', options: ['So', 'Sd', 'Na', 'Sn'], correctIndex: 2, explanation: 'Sodium\'s symbol Na comes from the Latin "natrium."' },
                { id: 8, question: 'What type of rock is formed from cooled lava?', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Mineral'], correctIndex: 2, explanation: 'Igneous rock forms when molten lava or magma cools and solidifies.' },
            ],
            hard: [
                { id: 1, question: "What is Heisenberg's Uncertainty Principle?", options: ['You cannot know the exact position and momentum of a particle simultaneously', 'Energy cannot be created or destroyed', 'Every action has an equal reaction', 'Entropy always increases'], correctIndex: 0, explanation: "Heisenberg's Uncertainty Principle states that position and momentum cannot both be precisely known at the same time." },
                { id: 2, question: 'What is the Schwarzschild radius?', options: ['The radius of any star', 'The radius defining the event horizon of a black hole', 'The radius of an electron orbit', 'The radius of the observable universe'], correctIndex: 1, explanation: "The Schwarzschild radius is the radius below which an object becomes a black hole — its event horizon." },
                { id: 3, question: 'What are quarks?', options: ['A type of star', 'Elementary particles that make up protons and neutrons', 'A unit of energy', 'A type of radiation'], correctIndex: 1, explanation: 'Quarks are elementary particles that combine to form hadrons like protons and neutrons. There are 6 flavors.' },
                { id: 4, question: 'What is the Pauli Exclusion Principle?', options: ['No two fermions can occupy the same quantum state', 'Energy is quantized', 'Matter cannot be created', 'Light is both wave and particle'], correctIndex: 0, explanation: 'The Pauli Exclusion Principle states that no two identical fermions (like electrons) can occupy the same quantum state simultaneously.' },
                { id: 5, question: 'What is CRISPR?', options: ['A type of telescope', 'A gene-editing technology', 'A particle accelerator', 'A chemical compound'], correctIndex: 1, explanation: 'CRISPR is a gene-editing tool that allows precise modification of DNA sequences.' },
                { id: 6, question: 'What is the equivalence principle in general relativity?', options: ['All forces are equivalent', 'Gravitational and inertial mass are equivalent', 'Energy and mass are equivalent', 'All reference frames are equivalent'], correctIndex: 1, explanation: "Einstein's equivalence principle states that gravitational mass and inertial mass are indistinguishable — a key foundation of general relativity." },
                { id: 7, question: 'What is the half-life of Carbon-14?', options: ['1,200 years', '5,730 years', '10,000 years', '50,000 years'], correctIndex: 1, explanation: 'Carbon-14 has a half-life of approximately 5,730 years, making it useful for dating organic materials.' },
                { id: 8, question: 'What is a Bose-Einstein condensate?', options: ['A type of star', 'A state of matter near absolute zero where atoms act as one', 'A particle accelerator result', 'A type of chemical bond'], correctIndex: 1, explanation: 'A Bose-Einstein condensate is a state of matter formed near absolute zero where bosons occupy the lowest quantum state.' },
            ],
        },
    },
];

const DIFFICULTY_CONFIG = {
    easy: { label: 'Easy', timePerQuestion: 20, pointsPerQuestion: 100, color: 'easy' },
    medium: { label: 'Medium', timePerQuestion: 15, pointsPerQuestion: 150, color: 'medium' },
    hard: { label: 'Hard', timePerQuestion: 10, pointsPerQuestion: 200, color: 'hard' },
};

// ---------- Game State ----------
const state = {
    playerName: '',
    categoryId: CATEGORIES[0].id,
    difficulty: 'medium',
    questions: [],
    currentIndex: 0,
    selectedIndex: null,
    showResult: false,
    timeLeft: 0,
    answers: [],
    startTime: 0,
    questionStartTime: 0,
    timerInterval: null,
    saved: false,
};

// ---------- DOM Helpers ----------
const $ = (id) => document.getElementById(id);
const screens = {
    start: $('start-screen'),
    quiz: $('quiz-screen'),
    result: $('result-screen'),
    leaderboard: $('leaderboard-screen'),
};

function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// ---------- Start Screen Setup ----------
function renderCategoryGrid() {
    const grid = $('category-grid');
    grid.innerHTML = '';
    CATEGORIES.forEach((cat) => {
        const card = document.createElement('button');
        card.className = 'category-card' + (cat.id === state.categoryId ? ' selected' : '');
        card.innerHTML = `
      <span class="category-card-icon">${cat.icon}</span>
      <p class="category-card-name">${cat.name}</p>
      <p class="category-card-desc">${cat.description}</p>
    `;
        card.addEventListener('click', () => {
            state.categoryId = cat.id;
            renderCategoryGrid();
        });
        grid.appendChild(card);
    });
}

function renderDifficultyGrid() {
    const grid = $('difficulty-grid');
    grid.innerHTML = '';
    Object.keys(DIFFICULTY_CONFIG).forEach((diff) => {
        const cfg = DIFFICULTY_CONFIG[diff];
        const card = document.createElement('button');
        card.className = 'difficulty-card ' + cfg.color + (diff === state.difficulty ? ' selected' : '');
        card.innerHTML = `
      <p class="difficulty-card-label">${cfg.label}</p>
      <div class="difficulty-card-meta">
        <span>⏱ ${cfg.timePerQuestion}s</span>
        <span>⚡ ${cfg.pointsPerQuestion}</span>
      </div>
    `;
        card.addEventListener('click', () => {
            state.difficulty = diff;
            renderDifficultyGrid();
        });
        grid.appendChild(card);
    });
}

function handleStart() {
    const nameInput = $('player-name');
    const name = nameInput.value.trim();
    const errorEl = $('name-error');
    if (!name) {
        errorEl.textContent = 'Please enter your name to begin';
        nameInput.focus();
        return;
    }
    errorEl.textContent = '';
    state.playerName = name;
    startQuiz();
}

// ---------- Quiz Logic ----------
function startQuiz() {
    const category = CATEGORIES.find((c) => c.id === state.categoryId);
    state.questions = category.questions[state.difficulty];
    state.currentIndex = 0;
    state.selectedIndex = null;
    state.showResult = false;
    state.answers = [];
    state.startTime = Date.now();

    const cfg = DIFFICULTY_CONFIG[state.difficulty];
    $('quiz-total-label').textContent = `/${state.questions.length}`;
    $('quiz-meta').textContent = `${category.name} · ${cfg.label}`;
    $('playing-as').textContent = `Playing as ${state.playerName}`;

    renderQuestion();
    showScreen('quiz');
}

function renderQuestion() {
    const q = state.questions[state.currentIndex];
    const cfg = DIFFICULTY_CONFIG[state.difficulty];
    state.selectedIndex = null;
    state.showResult = false;
    state.timeLeft = cfg.timePerQuestion;
    state.questionStartTime = Date.now();

    // Update top bar
    const currentScore = state.answers.reduce((s, a) => s + a.pointsEarned, 0);
    const correctCount = state.answers.filter((a) => a.correct).length;
    $('quiz-score').textContent = currentScore;
    $('quiz-correct').textContent = correctCount;

    // Progress
    $('question-counter').textContent = `Question ${state.currentIndex + 1} of ${state.questions.length}`;
    const progress = (state.currentIndex / state.questions.length) * 100;
    $('progress-fill').style.width = progress + '%';

    // Question
    $('question-text').textContent = q.question;

    // Options
    const optionsList = $('options-list');
    optionsList.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + index)}</span>
      <span>${option}</span>
    `;
        btn.addEventListener('click', () => handleSelect(index));
        optionsList.appendChild(btn);
    });

    // Hide explanation and next button
    $('explanation-box').classList.add('hidden');
    $('next-btn').classList.add('hidden');
    $('timer-wrap').classList.remove('hidden');

    startTimer();
}

function startTimer() {
    clearInterval(state.timerInterval);
    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        updateTimerDisplay();
        if (state.timeLeft <= 0) {
            clearInterval(state.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const cfg = DIFFICULTY_CONFIG[state.difficulty];
    const text = $('timer-text');
    const circle = $('timer-circle');
    const circumference = 175.93;

    text.textContent = state.timeLeft;
    const pct = state.timeLeft / cfg.timePerQuestion;
    circle.style.strokeDashoffset = circumference * (1 - pct);

    if (state.timeLeft <= 5) {
        text.classList.add('danger');
        circle.classList.add('danger');
    } else {
        text.classList.remove('danger');
        circle.classList.remove('danger');
    }
}

function handleSelect(index) {
    if (state.showResult || state.selectedIndex !== null) return;
    clearInterval(state.timerInterval);

    const q = state.questions[state.currentIndex];
    const cfg = DIFFICULTY_CONFIG[state.difficulty];
    const timeTakenMs = Date.now() - state.questionStartTime;
    const isCorrect = index === q.correctIndex;
    const timeBonus = Math.round((state.timeLeft / cfg.timePerQuestion) * 50);
    const pointsEarned = isCorrect ? cfg.pointsPerQuestion + timeBonus : 0;

    state.selectedIndex = index;
    state.showResult = true;
    state.answers.push({ questionId: q.id, selectedIndex: index, correct: isCorrect, timeTakenMs, pointsEarned });

    // Update option styles
    const buttons = $('options-list').querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
        btn.classList.add('locked');
        if (i === q.correctIndex) {
            btn.classList.add('correct');
            btn.querySelector('.option-letter').textContent = '✓';
        } else if (i === index) {
            btn.classList.add('wrong');
            btn.querySelector('.option-letter').textContent = '✕';
        } else {
            btn.classList.add('dim');
        }
    });

    // Explanation
    const expBox = $('explanation-box');
    let prefix;
    if (isCorrect) {
        prefix = 'Correct! ';
        expBox.classList.add('correct-bg');
    } else {
        prefix = 'Not quite. ';
        expBox.classList.remove('correct-bg');
    }
    expBox.innerHTML = `<span class="explanation-prefix">${prefix}</span>${q.explanation}`;
    expBox.classList.remove('hidden');

    // Next button
    const isLast = state.currentIndex === state.questions.length - 1;
    $('next-btn').innerHTML = isLast
        ? 'See Results <span class="btn-arrow">▸</span>'
        : 'Next Question <span class="btn-arrow">▸</span>';
    $('next-btn').classList.remove('hidden');

    // Update score
    const currentScore = state.answers.reduce((s, a) => s + a.pointsEarned, 0);
    const correctCount = state.answers.filter((a) => a.correct).length;
    $('quiz-score').textContent = currentScore;
    $('quiz-correct').textContent = correctCount;

    // Update progress to include this answered question
    const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
    $('progress-fill').style.width = progress + '%';

    // Hide timer
    $('timer-wrap').classList.add('hidden');
}

function handleTimeout() {
    if (state.selectedIndex !== null) return;
    const q = state.questions[state.currentIndex];
    const cfg = DIFFICULTY_CONFIG[state.difficulty];

    state.selectedIndex = -1;
    state.showResult = true;
    state.answers.push({ questionId: q.id, selectedIndex: -1, correct: false, timeTakenMs: cfg.timePerQuestion * 1000, pointsEarned: 0 });

    // Show correct answer
    const buttons = $('options-list').querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
        btn.classList.add('locked');
        if (i === q.correctIndex) {
            btn.classList.add('correct');
            btn.querySelector('.option-letter').textContent = '✓';
        } else {
            btn.classList.add('dim');
        }
    });

    // Explanation
    const expBox = $('explanation-box');
    expBox.classList.remove('correct-bg');
    expBox.innerHTML = `<span class="explanation-prefix">Time's up! </span>${q.explanation}`;
    expBox.classList.remove('hidden');

    // Next button
    const isLast = state.currentIndex === state.questions.length - 1;
    $('next-btn').innerHTML = isLast
        ? 'See Results <span class="btn-arrow">▸</span>'
        : 'Next Question <span class="btn-arrow">▸</span>';
    $('next-btn').classList.remove('hidden');

    // Update progress
    const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
    $('progress-fill').style.width = progress + '%';

    // Hide timer
    $('timer-wrap').classList.add('hidden');
}

function handleNext() {
    if (state.currentIndex === state.questions.length - 1) {
        finishQuiz();
    } else {
        state.currentIndex++;
        renderQuestion();
    }
}

function finishQuiz() {
    clearInterval(state.timerInterval);
    const totalTimeMs = Date.now() - state.startTime;
    const correctCount = state.answers.filter((a) => a.correct).length;
    const totalQuestions = state.answers.length;
    const totalScore = state.answers.reduce((s, a) => s + a.pointsEarned, 0);
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const timeSeconds = (totalTimeMs / 1000).toFixed(1);

    // Rank
    let rankLabel, rankIcon;
    if (accuracy === 100) { rankLabel = 'Perfect Score!'; rankIcon = '★'; }
    else if (accuracy >= 75) { rankLabel = 'Excellent!'; rankIcon = '↗'; }
    else if (accuracy >= 50) { rankLabel = 'Good Effort'; rankIcon = '★'; }
    else { rankLabel = 'Keep Practicing'; rankIcon = '↻'; }
    $('rank-icon').textContent = rankIcon;
    $('rank-label').textContent = rankLabel;

    // Score ring
    const circumference = 402.12;
    $('score-ring-circle').style.strokeDashoffset = circumference * (1 - accuracy / 100);
    $('accuracy-value').textContent = accuracy + '%';

    // Stats
    $('total-score').textContent = totalScore;
    $('result-correct').textContent = correctCount;
    $('result-wrong').textContent = totalQuestions - correctCount;
    $('result-time').textContent = timeSeconds + 's';

    const category = CATEGORIES.find((c) => c.id === state.categoryId);
    const cfg = DIFFICULTY_CONFIG[state.difficulty];
    $('result-category').textContent = category.name;
    $('result-difficulty').textContent = cfg.label;

    // Reset save state
    state.saved = false;
    $('save-score-btn').classList.remove('hidden');
    $('save-success').classList.add('hidden');
    $('save-error').textContent = '';

    showScreen('result');
}

// ---------- Save Score ----------
async function handleSaveScore() {
    if (state.saved) return;
    $('save-error').textContent = '';

    if (!supabase) {
        $('save-error').textContent = 'Leaderboard is not available right now.';
        return;
    }

    const correctCount = state.answers.filter((a) => a.correct).length;
    const totalQuestions = state.answers.length;
    const totalScore = state.answers.reduce((s, a) => s + a.pointsEarned, 0);
    const totalTimeMs = Date.now() - state.startTime;
    const category = CATEGORIES.find((c) => c.id === state.categoryId);
    const cfg = DIFFICULTY_CONFIG[state.difficulty];

    try {
        const { error } = await supabase.from('quiz_scores').insert({
            player_name: state.playerName,
            score: totalScore,
            correct_count: correctCount,
            total_questions: totalQuestions,
            category: category.name,
            difficulty: cfg.label,
            time_taken_ms: totalTimeMs,
        });
        if (error) throw error;
        state.saved = true;
        $('save-score-btn').classList.add('hidden');
        $('save-success').classList.remove('hidden');
    } catch (err) {
        $('save-error').textContent = 'Could not save your score. Please try again.';
    }
}

// ---------- Share ----------
function handleShare() {
    const correctCount = state.answers.filter((a) => a.correct).length;
    const totalScore = state.answers.reduce((s, a) => s + a.pointsEarned, 0);
    const category = CATEGORIES.find((c) => c.id === state.categoryId);
    const text = `I scored ${totalScore} points in QuizArena (${correctCount}/${state.answers.length} correct in ${category.name})!`;
    if (navigator.share) {
        navigator.share({ title: 'QuizArena Score', text }).catch(() => { });
    } else {
        navigator.clipboard.writeText(text).catch(() => { });
    }
}

// ---------- Leaderboard ----------
async function fetchLeaderboard() {
    const content = $('leaderboard-content');
    const refreshIcon = $('lb-refresh-icon');

    if (!supabase) {
        content.innerHTML = `
      <div class="lb-error">
        <p class="lb-empty-text" style="color: var(--rose-400); margin-bottom: 0.75rem;">Leaderboard is not available right now.</p>
      </div>
    `;
        return;
    }

    refreshIcon.classList.add('spinning');
    content.innerHTML = `
    <div class="lb-loading">
      <span class="lb-loading-icon">↻</span>
      <p class="lb-empty-text">Loading scores...</p>
    </div>
  `;

    try {
        const { data, error } = await supabase
            .from('quiz_scores')
            .select('*')
            .order('score', { ascending: false })
            .order('time_taken_ms', { ascending: true })
            .limit(25);

        if (error) throw error;

        if (!data || data.length === 0) {
            content.innerHTML = `
        <div class="lb-empty">
          <span class="lb-empty-icon">🏆</span>
          <p class="lb-empty-text">No scores yet</p>
          <p class="lb-empty-sub">Be the first to play and claim the top spot!</p>
        </div>
      `;
            return;
        }

        const rankIcons = ['👑', '🥈', '🥉'];
        const rankClasses = ['gold', 'silver', 'bronze'];

        content.innerHTML = data.map((entry, index) => {
            const isPodium = index < 3;
            const timeStr = (entry.time_taken_ms / 1000).toFixed(1) + 's';
            const dateStr = formatDate(entry.created_at);

            if (isPodium) {
                return `
          <div class="lb-entry podium podium-${index}">
            <div class="lb-rank-icon ${rankClasses[index]}">${rankIcons[index]}</div>
            <div class="lb-info">
              <p class="lb-name">${escapeHtml(entry.player_name)}</p>
              <div class="lb-meta">
                <span>${escapeHtml(entry.category)}</span>
                <span class="lb-meta-dot">·</span>
                <span>${entry.correct_count}/${entry.total_questions}</span>
                <span class="lb-meta-dot">·</span>
                <span>${timeStr}</span>
              </div>
            </div>
            <div class="lb-score-col">
              <p class="lb-score">${entry.score}</p>
              <p class="lb-date">${dateStr}</p>
            </div>
          </div>
        `;
            }

            return `
        <div class="lb-entry">
          <div class="lb-rank-num">${index + 1}</div>
          <div class="lb-info">
            <p class="lb-name">${escapeHtml(entry.player_name)}</p>
            <div class="lb-meta">
              <span>${escapeHtml(entry.category)}</span>
              <span class="lb-meta-dot">·</span>
              <span>${entry.correct_count}/${entry.total_questions}</span>
              <span class="lb-meta-dot">·</span>
              <span>${timeStr}</span>
            </div>
          </div>
          <div class="lb-score-col">
            <p class="lb-score">${entry.score}</p>
            <p class="lb-date">${dateStr}</p>
          </div>
        </div>
      `;
        }).join('');
    } catch (err) {
        content.innerHTML = `
      <div class="lb-error">
        <p class="lb-empty-text" style="color: var(--rose-400); margin-bottom: 0.75rem;">Could not load the leaderboard.</p>
        <button class="btn btn-secondary" id="lb-retry-btn">Try Again</button>
      </div>
    `;
    } finally {
        refreshIcon.classList.remove('spinning');
    }
}

function formatDate(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return diffMin + 'm ago';
    if (diffHr < 24) return diffHr + 'h ago';
    if (diffDay < 7) return diffDay + 'd ago';
    return date.toLocaleDateString();
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---------- Navigation ----------
function goHome() {
    clearInterval(state.timerInterval);
    showScreen('start');
}

function playAgain() {
    startQuiz();
}

// ---------- Event Listeners ----------
function init() {
    renderCategoryGrid();
    renderDifficultyGrid();

    $('start-btn').addEventListener('click', handleStart);
    $('player-name').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleStart(); });
    $('leaderboard-btn').addEventListener('click', () => {
        showScreen('leaderboard');
        fetchLeaderboard();
    });

    $('quit-btn').addEventListener('click', goHome);
    $('next-btn').addEventListener('click', handleNext);

    $('save-score-btn').addEventListener('click', handleSaveScore);
    $('home-btn').addEventListener('click', goHome);
    $('play-again-btn').addEventListener('click', playAgain);
    $('share-btn').addEventListener('click', handleShare);

    $('lb-back-btn').addEventListener('click', () => showScreen('start'));
    $('lb-refresh-btn').addEventListener('click', fetchLeaderboard);
}

try {
    init();
} catch (e) {
    console.error('QuizArena failed to initialize:', e);
}

// Wire retry button after it's rendered
$('leaderboard-content').addEventListener('click', (e) => {
    if (e.target.id === 'lb-retry-btn') fetchLeaderboard();
});
