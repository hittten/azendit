import { createTaskElement, createTaskElements, TaskEvent, taskListElement } from "./task-element.service";
import { createTask, getTasks, updateTask } from "./task.service";

// Elements
const taskInputElement = document.querySelector<HTMLInputElement>('#taskInput');

// Events
taskInputElement.onkeyup = (e) => {
  const input = e.target as HTMLInputElement;

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

taskListElement.addEventListener('TaskEvent', (e: TaskEvent) => {
  const { action, task } = e.detail

  if (action === 'Update') {
    updateTask(task)
    return
  }
});
