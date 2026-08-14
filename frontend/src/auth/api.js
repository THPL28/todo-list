import axios from "axios"

const storageKey = "todo_auth_token"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(storageKey)

  if (config.url?.startsWith("/auth/")) {
    delete config.headers.Authorization
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(storageKey)
    }
    return Promise.reject(error)
  },
)

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
