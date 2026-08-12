import { useEffect, useState } from "react"
import { fetchTasks, deleteTask, updateTask } from "../services/tasks"

export default function TaskList({ onTaskDeleted, onTaskUpdated }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks()
        setTasks(data.results || [])
      } catch (err) {
        setError("Não foi possível carregar tarefas.")
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed })
      setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)))
      onTaskUpdated?.(updated)
    } catch (err) {
      setError("Erro ao atualizar tarefa.")
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      onTaskDeleted?.(taskId)
    } catch (err) {
      setError("Erro ao excluir tarefa.")
    }
  }

  if (loading) return <p>Carregando tarefas...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>
  if (!tasks.length) return <p>Nenhuma tarefa cadastrada.</p>

  return (
    <div>
      <h2>Tarefas</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "1rem" }}>
            <strong>{task.title}</strong>
            <p>{task.description}</p>
            <p>Categoria: {task.category || "Nenhuma"}</p>
            <p>Concluída: {task.is_completed ? "Sim" : "Não"}</p>
            <button onClick={() => handleToggle(task)}>
              {task.is_completed ? "Marcar como pendente" : "Marcar como concluída"}
            </button>
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: "0.5rem" }}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
