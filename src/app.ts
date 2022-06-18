import {
  createTaskElement,
  createTaskElements,
  editTaskElement,
  formEditTask,
  TaskEvent,
  taskListElement
} from "./task-element.service";
import {createTask, deleteTask, getTasks, searchTasks, updateTask} from "./task.service";
import {tryObservables} from "./observables";
import {BehaviorSubject, debounceTime, distinctUntilChanged, Subject, switchMap, take, tap} from "rxjs";

// Elements
const taskInputElement = document.querySelector<HTMLInputElement>('#taskInput');
const searchInputElement = document.querySelector<HTMLInputElement>('#search');

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

filterButtonsContainer.addEventListener('click', (e) => {
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
  tasks.next(filter)
})

// App
const tasks = new BehaviorSubject('all')
tasks
  .pipe(
    switchMap(filter => getTasks(filter)),
  )
  .subscribe(createTaskElements)

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

window.onkeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    searchInputElement.classList.add('open')
    searchInputElement.focus()

    function onKeyupEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        searchInputElement.classList.remove('open')
        tasks.next('all')
        window.removeEventListener("keydown", onKeyupEscape)
      }
    }

    window.addEventListener("keydown", onKeyupEscape)
  }
}

const searchTerms = new Subject<string>();
searchTerms
  .pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),

    // switch to new search observable each time the term changes
    switchMap((term: string) => searchTasks(term)),
  )
  .subscribe(tasks => createTaskElements(tasks))

searchInputElement.onkeyup = () => {
  searchTerms.next(searchInputElement.value)
}

// tryObservables()
