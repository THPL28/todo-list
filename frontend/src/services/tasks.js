import api from "../auth/api"

export async function fetchTasks(params = {}) {
  const response = await api.get("/tasks/", { params })
  return response.data
}

export async function createTask(task) {
  const response = await api.post("/tasks/", task)
  return response.data
}

export async function updateTask(taskId, patch) {
  const response = await api.patch(`/tasks/${taskId}/`, patch)
  return response.data
}

export async function deleteTask(taskId) {
  await api.delete(`/tasks/${taskId}/`)
}
