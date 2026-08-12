import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../auth/api"
import { useAuth } from "../auth/AuthContext"
import { setAuthToken } from "../auth/api"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const { login: loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      const data = await login(username, password)
      const { access } = data
      loginUser(access)
      setAuthToken(access)
      navigate("/", { replace: true })
    } catch (err) {
      setError("Erro ao autenticar. Verifique usuário e senha.")
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Usuário
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}
