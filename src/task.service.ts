import { Task } from "./task";
import { getRandomId, TASKS } from "./tasks.mock"

// Task Functions
export function getTasks(filter = 'all') {
  if (filter === 'completed') {
    return TASKS.filter(task => task.done);
  }
  if (filter === 'pending') {
    return TASKS.filter(task => !task.done);
  }

  return TASKS;
}

export function createTask(description: string) {
  const task = {
    id: getRandomId(100, 999),
    description,
    done: false,
  };

  TASKS.push(task);

  return task
}

export function updateTask(task: Task) {
  const index = TASKS.findIndex(t => t.id === task.id);
  TASKS[index] = task;
}
