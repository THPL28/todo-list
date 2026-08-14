import { useState } from "react"
import { shareTask } from "../services/taskShares"

export default function TaskShareForm({ taskId }) {
  const [username, setUsername] = useState("")
  const [canEdit, setCanEdit] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)

    try {
      await shareTask({ taskId, username, canEdit })
      setMessage("Tarefa compartilhada.")
      setUsername("")
      setCanEdit(false)
    } catch {
      setMessage("Não foi possível compartilhar a tarefa.")
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "0.5rem" }}>
      <input
        aria-label="Usuário para compartilhar"
        placeholder="Nome de usuário"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <label style={{ marginLeft: "0.5rem" }}>
        <input
          type="checkbox"
          checked={canEdit}
          onChange={(event) => setCanEdit(event.target.checked)}
        />{" "}
        Pode editar
      </label>
      <button type="submit" style={{ marginLeft: "0.5rem" }}>Compartilhar</button>
      {message && <small style={{ marginLeft: "0.5rem" }}>{message}</small>}
    </form>
  )
}
