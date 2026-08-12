import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

export async function login(username, password) {
  const response = await api.post("/auth/login/", { username, password })
  return response.data
}

export async function register({ username, email, password }) {
  const response = await api.post("/auth/register/", { username, email, password })
  return response.data
}

export default api
