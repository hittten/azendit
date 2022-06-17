import { Task } from "./task";
import { getRandomId, TASKS } from "./tasks.mock"

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Task Functions
export async function getTasks(filter = 'all') {
  await delay(500)

  if (filter === 'completed') {
    return TASKS.filter(task => task.done);
  }
  if (filter === 'pending') {
    return TASKS.filter(task => !task.done);
  }

  return TASKS;
}

export async function createTask(description: string) {
  await delay(1000)
  const task = {
    id: getRandomId(100, 999),
    description,
    done: false,
  };

  TASKS.push(task);
  return task
}

export async function updateTask(task: Task) {
  await delay(1000)
  const index = TASKS.findIndex(t => t.id === task.id);
  TASKS[index] = task;
}

export const deleteTask = async (task: Task) => {
  await delay(1000)
  const index = TASKS.findIndex(t => t.id === task.id);
  TASKS.splice(index, 1);
}
