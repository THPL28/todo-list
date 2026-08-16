import { useState } from "react"
import { shareTask } from "../services/taskShares"

export default function TaskShareForm({ taskId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [canEdit, setCanEdit] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)

    try {
      await shareTask({ taskId, username, canEdit })
      setMessage("Tarefa compartilhada!")
      setUsername("")
      setCanEdit(false)
      setTimeout(() => {
        setIsOpen(false)
        setMessage(null)
      }, 1500)
    } catch {
      setMessage("Não foi possível compartilhar.")
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <button 
        type="button"
        className="icon-btn" 
        onClick={() => setIsOpen(!isOpen)} 
        title="Compartilhar tarefa"
        style={{ background: isOpen ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.04)" }}
      >
        🔗
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "110%",
          right: 0,
          background: "#181236",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "8px",
          padding: "0.75rem",
          zIndex: 10,
          width: "200px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
        }}>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem" }}>
            <input
              aria-label="Usuário para compartilhar"
              placeholder="Nome de usuário"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#a29dbd" }}>
              <input
                type="checkbox"
                checked={canEdit}
                onChange={(event) => setCanEdit(event.target.checked)}
                style={{ width: "auto" }}
              />
              Pode editar
            </label>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button type="submit" style={{ flex: 1, padding: "0.3rem 0.5rem", fontSize: "0.75rem" }}>Enviar</button>
              <button type="button" onClick={() => setIsOpen(false)} style={{ background: "rgba(255, 255, 255, 0.05)", padding: "0.3rem 0.5rem", fontSize: "0.75rem" }}>Fechar</button>
            </div>
          </form>
          {message && <small style={{ display: "block", marginTop: "0.4rem", fontSize: "0.7rem", color: "#38bdf8" }}>{message}</small>}
        </div>
      )}
    </div>
  )
}
