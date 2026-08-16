import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../auth/api"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError(null)
    try {
      await register({ username, email, password })
      navigate("/login", { replace: true })
    } catch (err) {
      const details = err.response?.data
      setError(
        details && typeof details === "object"
          ? Object.values(details).flat().join(" ")
          : "Erro ao registrar. Verifique os dados e tente novamente."
      )
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card reveal">
        <span className="eyebrow">comece agora</span>
        <h1>Crie seu espaço.</h1>
        <p>Menos ruído, mais clareza para suas tarefas.</p>
        <form className="stack" onSubmit={submit}>
          <label>
            Usuário
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>
          <button type="submit">Registrar</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>Já possui uma conta? <Link to="/login">Entrar</Link></p>
      </section>
    </div>
  )
}
