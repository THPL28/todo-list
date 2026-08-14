import { useEffect, useState } from "react"
import { fetchTasks, updateTask } from "../services/tasks"

export default function KanbanBoard({ refreshVersion }) {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetchTasks({ page_size: 100 }).then((data) => setTasks(data.results || [])).catch(() => setTasks([]))
  }, [refreshVersion])

  const toggle = async (task) => {
    const updated = await updateTask(task.id, { is_completed: !task.is_completed })
    setTasks((current) => current.map((item) => item.id === task.id ? updated : item))
  }

  const columns = [
    { title: "A fazer", tasks: tasks.filter((task) => !task.is_completed) },
    { title: "Concluídas", tasks: tasks.filter((task) => task.is_completed) },
  ]

  return <section className="panel reveal kanban"><div className="section-heading"><div><span className="eyebrow">visão geral</span><h2>Kanban</h2></div><span>{tasks.length} tarefas</span></div><div className="kanban-columns">{columns.map((column) => <div className="kanban-column" key={column.title}><h3>{column.title}<span>{column.tasks.length}</span></h3>{column.tasks.map((task) => <article className="kanban-card" key={task.id}><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}<small>{task.due_date ? `Prazo: ${task.due_date}` : "Sem prazo"}</small><button onClick={() => toggle(task)}>{task.is_completed ? "Reabrir" : "Concluir"}</button></article>)}{!column.tasks.length && <p className="empty">Nada por aqui.</p>}</div>)}</div></section>
}
