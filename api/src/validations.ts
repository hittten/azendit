export const getTaskError = (body: Record<string, any>) => {
  if (!body.description) {
    return 'description is required!'
  }

  if (body.description.length > 100) {
    return `description is to big! current: ${body.description.length}, max: 100`
  }

  if (body.done !== undefined && typeof body.done !== 'boolean') {
    return 'done must be boolean'
  }

  return false
}
