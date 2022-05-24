console.log('hello world');

// Mock
const TASKS = [
  {
    id: 1,
    description: 'Mi primera tarea',
    done: false,
  },
  {
    id: 2,
    description: 'Una tarea sin terminar',
    done: false,
  },
  {
    id: 3,
    description: 'Una tarea terminada',
    done: true,
  },
  {
    id: 4,
    description: 'Una tarea para editar',
    done: false,
  },
  {
    id: 5,
    description: 'Una tarea para eliminar',
    done: true,
  },
  {
    id: 6,
    description: 'Una tarea con un texto muy largo: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquid asperiores consequuntur dolorem excepturi fugiat harum ipsa iure laboriosam libero minima neque porro possimus quam, quasi qui saepe velit veritatis."',
    done: false,
  },
  {
    id: 7,
    description: 'Tarea numero 7',
    done: false,
  },
  {
    id: 8,
    description: 'Tarea numero 8',
    done: false,
  },
  {
    id: 9,
    description: 'Tarea numero 9',
    done: false,
  },
  {
    id: 10,
    description: 'Tarea numero 10',
    done: false,
  },
];

//The maximum is exclusive and the minimum is inclusive
function getRandomId(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const randomInt = Math.floor(Math.random() * (max - min) + min);
  return randomInt + new Date().getTime().toString()
}

// Elements
const taskListElement = document.querySelector('#taskList');
const taskInputElement = document.querySelector('#taskInput');

// Task Functions
function getTasks(filter = 'all') {
  if (filter === 'completed') {
    return TASKS.filter(task => task.done);
  }
  if (filter === 'pending') {
    return TASKS.filter(task => !task.done);
  }

  return TASKS;
}

function createTask(description) {
  const task = {
    id: getRandomId(100, 999),
    description,
    done: false,
  };

  TASKS.push(task);

  return task
}

// Task Element Functions
function createTaskElement(task) {
  const element = document.createElement('li')

  element.innerHTML = `
    <div>
      <input type="checkbox" ${task.done ? 'checked' : ''}>
      <span>${task.description}</span>
    </div>
    <span class="material-icons btn-delete">delete_outline</span>
    <textarea>${task.description}</textarea>
    <span class="material-icons btn-save">done</span>
  `;

  return element
}

function createTaskElements(tasks) {
  taskListElement.innerHTML = '';
  for (const task of tasks) {
    const taskElement = createTaskElement(task)
    taskListElement.appendChild(taskElement)
  }
}

// Events
taskInputElement.onkeyup = (e) => {
  const input = e.target;

  if (e.key === 'Enter' && input.value) {
    input.focus();
    const task = createTask(input.value);
    const taskElement = createTaskElement(task);
    input.value = '';

    taskListElement.appendChild(taskElement);
  }
};

// Filter control
const filterButtonsContainer = document.querySelector('.filterButtons');
const filterButtons = filterButtonsContainer.querySelectorAll('button');

filterButtonsContainer.addEventListener('click', (e) => {
  const button = e.target;
  if (!(button instanceof HTMLButtonElement)) {
    return
  }

  const filter = button.dataset.filter
  createTaskElements(getTasks(filter))

  // disable buttons
  for (const btn of filterButtons) {
    btn.disabled = false;
  }
  button.disabled = true;
})

// App
createTaskElements(getTasks());
