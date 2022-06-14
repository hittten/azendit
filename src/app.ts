import {
  createTaskElement,
  createTaskElements,
  editTaskElement,
  formEditTask,
  TaskEvent,
  taskListElement
} from "./task-element.service";
import {createTask, deleteTask, getTasks, updateTask} from "./task.service";

// Elements
const taskInputElement = document.querySelector<HTMLInputElement>('#taskInput');

// Events
taskInputElement.onkeyup = async (e) => {
  const input = e.target as HTMLInputElement;

  if (e.key === 'Enter' && input.value) {
    input.disabled = true;
    const task = await createTask(input.value);
    const taskElement = createTaskElement(task);
    taskElement.classList.add('adding')
    taskListElement.appendChild(taskElement);
    input.value = '';
    input.disabled = false;
    input.focus();
  }
};

// Filter control
const filterButtonsContainer = document.querySelector('.filterButtons');
const filterButtons = filterButtonsContainer.querySelectorAll('button');

filterButtonsContainer.addEventListener('click', async (e) => {
  const button = e.target;
  if (!(button instanceof HTMLButtonElement)) {
    return
  }

  // disable buttons
  for (const btn of filterButtons) {
    btn.disabled = false;
  }
  button.disabled = true;
  taskListElement.innerHTML = 'loading...'

  const filter = button.dataset.filter
  const tasks = await getTasks(filter)
  createTaskElements(tasks)
})

// App
getTasks()
  .then(tasks => createTaskElements(tasks))

taskListElement.addEventListener('TaskEvent', async (e: TaskEvent) => {
  const element = e.target as HTMLLIElement
  const {action, task} = e.detail

  if (action === 'Update') {
    await updateTask(task)
    editTaskElement(element, task)
  }

  if (action === 'Delete') {
    deleteTask(task)
    element.addEventListener('animationend', () => element.remove())
    element.classList.add('removing')
  }

  formEditTask(element, false)
});
