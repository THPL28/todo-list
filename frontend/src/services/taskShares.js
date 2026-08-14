import api from "../auth/api"

export async function shareTask({ taskId, username, canEdit }) {
  const response = await api.post("/task-shares/", {
    task: taskId,
    shared_with_username: username,
    can_edit: canEdit,
  })
  return response.data
}
