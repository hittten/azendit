import { Task } from "./task";

export const taskListElement = document.querySelector('#taskList');
export type TaskEvent = CustomEvent<{ action: string, task: Task }>

// Task Element Functions
export function createTaskElement(task: Task) {
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

  setEvents(element, task)

  return element
}

function setEvents(element: HTMLLIElement, task: Task) {
  const checkboxDone = element.querySelector('input')

  checkboxDone.onchange = () =>
    taskEvent({ ...task, done: checkboxDone.checked }, element, 'Update')
}

function taskEvent(task: Task, element: HTMLLIElement, action: string) {
  const TaskEvent = new CustomEvent('TaskEvent', {
    bubbles: true,
    detail: {
      action,
      task,
    }
  });

  element.dispatchEvent(TaskEvent)
}

export function createTaskElements(tasks: Task[]) {
  taskListElement.innerHTML = '';
  for (const task of tasks) {
    const taskElement = createTaskElement(task)
    taskListElement.appendChild(taskElement)
  }
}
