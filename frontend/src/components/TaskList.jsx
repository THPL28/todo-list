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
      <div className="panel-header">
        <h2>Tarefas</h2>
        <span className="eyebrow">{total} no total</span>
      </div>
      
      {/* Search Filters */}
      <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", marginBottom: "1.5rem" }}>
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
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <input aria-label="Data inicial" name="start_date" type="date" value={filters.start_date} onChange={changeFilter} style={{ flex: 1 }} />
          <input aria-label="Data final" name="end_date" type="date" value={filters.end_date} onChange={changeFilter} style={{ flex: 1 }} />
        </div>
      </div>

      {!tasks.length && <p className="empty">Nenhuma tarefa encontrada.</p>}
      
      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {tasks.map((task) => {
          const categoryObj = categories.find(c => c.id === task.category);
          return (
            <div key={task.id} className="task-item">
              <div className="task-item-left">
                <div 
                  className={`task-status-dot ${task.is_completed ? 'completed' : 'pending'}`} 
                  onClick={() => handleToggle(task)}
                  title={task.is_completed ? "Marcar como pendente" : "Marcar como concluída"}
                />
                <div className={`task-details ${task.is_completed ? 'completed' : ''}`}>
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem", alignItems: "center" }}>
                    {categoryObj && (
                      <span className="eyebrow" style={{ fontSize: "0.65rem", background: "rgba(56, 189, 248, 0.08)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                        {categoryObj.name}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="eyebrow" style={{ fontSize: "0.65rem", color: "#a78bfa" }}>
                        📅 {task.due_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="task-item-actions">
                <div 
                  className="icon-btn" 
                  onClick={() => handleToggle(task)} 
                  title={task.is_completed ? "Desmarcar" : "Concluir"}
                >
                  ✓
                </div>
                <div 
                  className="icon-btn delete" 
                  onClick={() => handleDelete(task.id)} 
                  title="Excluir"
                >
                  ✕
                </div>
                <TaskShareForm taskId={task.id} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Anterior</button>
        <span style={{ fontSize: "0.85rem", color: "#8b85b1" }}>Página {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Próxima</button>
      </div>
    </div>
  )
}
