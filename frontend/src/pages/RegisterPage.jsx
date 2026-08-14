import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../auth/api"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    try {
      await register({ username, email, password })
      navigate("/login", { replace: true })
    } catch (err) {
      const details = err.response?.data
      const message = details && typeof details === "object"
        ? Object.values(details).flat().join(" ")
        : "Erro ao registrar. Verifique os dados e tente novamente."
      setError(message)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      <h1>Registrar</h1>
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
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
        <button type="submit">Registrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}
