import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login, setAuthToken } from "../auth/api"
import { useAuth } from "../auth/AuthContext"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const { login: saveToken } = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError(null)
    try {
      const { access } = await login(username, password)
      saveToken(access)
      setAuthToken(access)
      navigate("/", { replace: true })
    } catch {
      setError("Não foi possível entrar. Revise suas credenciais.")
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card reveal">
        <span className="eyebrow">todo / workspace</span>
        <h1>Boas-vindas.</h1>
        <p>Entre para organizar o que importa.</p>
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
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit">Entrar</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>Não tem conta? <Link to="/register">Crie sua conta</Link></p>
      </section>
    </div>
  )
}
