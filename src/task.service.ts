import {Task} from "./task";

const apiUrl = 'http://localhost:3000'

// Task Functions
export async function getTasks(filter = 'all') {
  const response = await fetch(`${apiUrl}/tasks?filter=${filter}`)
  return response.json()
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
