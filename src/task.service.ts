import {Task} from "./task";
import {filter, Observable, switchMap, timer} from "rxjs";

const apiUrl = 'http://localhost:3000'

// Task Functions
export function getTasks(filterParam = 'all') {
  let currentData = ''
  return timer(0, 1000)
    .pipe(
      filter(() => document.hasFocus()),
      switchMap(() => fetch(`${apiUrl}/tasks?filter=${filterParam}`)),
      switchMap(response => response.json() as Promise<Task[]>),
      filter(tasks => {
        const json = JSON.stringify(tasks)
        if (currentData !== json) {
          currentData = json
          return true
        }
      }),
    )
}

export function getTasks2(filter = 'all') {
  let currentData = ''
  return new Observable<Task[]>(subscriber => {
    setInterval(() => {
      fetch(`${apiUrl}/tasks?filter=${filter}`)
        .then(response => response.json())
        .then(tasks => {
          const json = JSON.stringify(tasks)
          if (currentData !== json) {
            currentData = json
            subscriber.next(tasks)
          }
        })
    }, 1000)
  })
}

export async function searchTasks(text: string) {
  const response = await fetch(`${apiUrl}/tasks?search=${text}`)
  return response.json()
}

export async function createTask(description: string) {
  const response = await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description,
    }),
  })
  return response.json()
}

export async function updateTask(task: Task) {
  const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  return response.json()
}

export const deleteTask = async (task: Task) => {
  const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
    method: 'DELETE',
  })
  return response.json()
}
