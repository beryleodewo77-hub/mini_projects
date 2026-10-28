const STORAGE_KEY = 'todo-list-items'

let todos = []
let currentFilter = 'all'

const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const filterBtns = document.querySelectorAll('.filter-btn')
const statsBar = document.getElementById('todo-stats')
const remainingCount = document.getElementById('remaining-count')
const clearBtn = document.getElementById('clear-completed')

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    todos = saved ? JSON.parse(saved) : []
  } catch {
    todos = []
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function render() {
  const filtered = todos.filter((t) => {
    if (currentFilter === 'active') return !t.completed
    if (currentFilter === 'completed') return t.completed
    return true
  })

  list.innerHTML = ''

  if (filtered.length === 0) {
    const empty = document.createElement('li')
    empty.className = 'todo-empty'
    const msg =
      currentFilter === 'completed'
        ? 'No completed tasks yet'
        : currentFilter === 'active'
          ? 'No active tasks — nice work!'
          : 'No tasks yet. Add one above!'
    empty.innerHTML = `<span class="icon">&#9745;</span>${msg}`
    list.appendChild(empty)
  } else {
    filtered.forEach((todo) => {
      const li = document.createElement('li')
      li.className = 'todo-item' + (todo.completed ? ' completed' : '')
      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} />
        <span class="todo-text">${escapeHtml(todo.title)}</span>
        <button class="todo-delete" aria-label="Delete task">&times;</button>
      `

      const checkbox = li.querySelector('.todo-checkbox')
      checkbox.addEventListener('change', () => toggleTodo(todo.id))

      const deleteBtn = li.querySelector('.todo-delete')
      deleteBtn.addEventListener('click', () => deleteTodo(todo.id))

      list.appendChild(li)
    })
  }

  const remaining = todos.filter((t) => !t.completed).length
  const hasCompleted = todos.some((t) => t.completed)

  if (todos.length > 0) {
    statsBar.style.display = 'flex'
    remainingCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`
    clearBtn.disabled = !hasCompleted
  } else {
    statsBar.style.display = 'none'
  }
}

function addTodo(title) {
  todos.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title,
    completed: false,
  })
  saveTodos()
  render()
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    render()
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id)
  saveTodos()
  render()
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed)
  saveTodos()
  render()
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const title = input.value.trim()
  if (!title) return
  addTodo(title)
  input.value = ''
  input.focus()
})

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter
    filterBtns.forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    render()
  })
})

clearBtn.addEventListener('click', clearCompleted)

loadTodos()
render()
