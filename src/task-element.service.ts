import { openDialog } from "./dialog.service";
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

export function editTaskElement(element: HTMLLIElement, task: Task) {
  element.querySelector('span').textContent = task.description
}

export function formEditTask(element: HTMLLIElement, enable: boolean) {
  if (enable) {
    element.classList.add('updating')
  } else {
    element.classList.remove('updating')
  }
}

function setEvents(element: HTMLLIElement, task: Task) {
  const checkboxDone: HTMLInputElement = element.querySelector('input')
  const updateInput: HTMLTextAreaElement = element.querySelector('textarea')
  const buttonSave: HTMLSpanElement = element.querySelector('.btn-save')
  const buttonDelete: HTMLSpanElement = element.querySelector('.btn-delete')

  checkboxDone.onchange = () =>
    taskEvent({ ...task, done: checkboxDone.checked }, element, 'Update')

  element.ondblclick = () => {
    formEditTask(element, true)
    updateInput.focus()
  }

  buttonSave.onclick = () =>
    taskEvent({ ...task, description: updateInput.value }, element, 'Update')

  updateInput.onkeyup = (e) => {
    if (e.code === 'Escape') {
      formEditTask(element, false)
      return
    }
    if (e.code === 'Enter') {
      taskEvent({ ...task, description: updateInput.value }, element, 'Update')
      return
    }
  }

  buttonDelete.onclick = () => {
    openDialog(task.description).then(value => {
      if (value) {
        taskEvent(task, element, 'Delete');
      }
    })
  }
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
