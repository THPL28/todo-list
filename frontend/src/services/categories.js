import api from "../auth/api"

export async function fetchCategories() {
  const response = await api.get("/categories/")
  return response.data
}

export async function createCategory(category) {
  const response = await api.post("/categories/", category)
  return response.data
}
