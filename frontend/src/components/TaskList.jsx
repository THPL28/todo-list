import { useEffect, useState } from "react"
import { fetchTasks, deleteTask, updateTask } from "../services/tasks"
import { fetchCategories } from "../services/categories"
import TaskShareForm from "./TaskShareForm"

const initialFilters = { title: "", status: "", category: "", start_date: "", end_date: "" }

export default function TaskList({ refreshVersion, onTaskDeleted, onTaskUpdated }) {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      try {
        const params = Object.fromEntries(
          Object.entries({ ...filters, page }).filter(([, value]) => value !== ""),
        )
        const data = await fetchTasks(params)
        setTasks(data.results || [])
        setTotal(data.count || 0)
      } catch {
        setError("Não foi possível carregar tarefas.")
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [filters, page, refreshVersion])

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data.results || [])).catch(() => {})
  }, [])

  const changeFilter = (event) => {
    setPage(1)
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed })
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)))
      onTaskUpdated?.(updated)
    } catch {
      setError("Erro ao atualizar tarefa.")
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks((current) => current.filter((task) => task.id !== taskId))
      setTotal((current) => current - 1)
      onTaskDeleted?.(taskId)
    } catch {
      setError("Erro ao excluir tarefa.")
    }
  }

  if (loading) return <p>Carregando tarefas...</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  const totalPages = Math.max(1, Math.ceil(total / 10))

  return (
    <div>
      <h2>Tarefas</h2>
      <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <input name="title" placeholder="Filtrar por título" value={filters.title} onChange={changeFilter} />
        <select name="status" value={filters.status} onChange={changeFilter}>
          <option value="">Todos os status</option>
          <option value="false">Pendentes</option>
          <option value="true">Concluídas</option>
        </select>
        <select name="category" value={filters.category} onChange={changeFilter}>
          <option value="">Todas as categorias</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <span>
          <input aria-label="Data inicial" name="start_date" type="date" value={filters.start_date} onChange={changeFilter} />
          <input aria-label="Data final" name="end_date" type="date" value={filters.end_date} onChange={changeFilter} style={{ marginLeft: "0.5rem" }} />
        </span>
      </div>
      {!tasks.length && <p>Nenhuma tarefa encontrada.</p>}
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
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: "0.5rem" }}>Excluir</button>
            <TaskShareForm taskId={task.id} />
          </li>
        ))}
      </ul>
      <div>
        <button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Anterior</button>
        <span style={{ margin: "0 0.5rem" }}>Página {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Próxima</button>
      </div>
    </div>
  )
}
