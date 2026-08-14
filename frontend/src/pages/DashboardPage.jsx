import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"
import CategoryForm from "../components/CategoryForm"
import KanbanBoard from "../components/KanbanBoard"
import { fetchTasks } from "../services/tasks"

export default function DashboardPage() {
  const { logout } = useAuth(); const [tasksVersion, setTasksVersion] = useState(0); const [categoriesVersion, setCategoriesVersion] = useState(0)
  return <div className="workspace"><aside className="sidebar reveal"><div><span className="eyebrow">todo / workspace</span><h2>Orbit</h2></div><nav><a href="#visao">Visão geral</a><a href="#kanban">Kanban</a><a href="#tarefas">Tarefas</a><a href="#categorias">Categorias</a></nav><button onClick={logout}>Sair</button></aside><main className="dashboard"><header className="topbar reveal"><div><span className="eyebrow">painel pessoal</span><h1>Seu foco, organizado.</h1></div></header><section id="visao" className="panel reveal progress-panel"><span className="eyebrow">ritmo da semana</span><h2>Progresso das atividades</h2><TaskProgress refreshVersion={tasksVersion} /></section><div id="kanban"><KanbanBoard refreshVersion={tasksVersion} /></div><div className="dashboard-grid"><div><section className="panel reveal"><TaskForm categoriesVersion={categoriesVersion} onTaskCreated={() => setTasksVersion((v) => v + 1)} /></section><section id="tarefas" className="panel reveal"><TaskList refreshVersion={tasksVersion} /></section></div><section id="categorias" className="panel reveal"><CategoryForm onCategoryCreated={() => setCategoriesVersion((v) => v + 1)} /></section></div></main></div>
}

function TaskProgress({ refreshVersion }) {
  const [progress, setProgress] = useState({ total: 0, completed: 0 })
  useEffect(() => { fetchTasks({ page_size: 100 }).then((data) => { const tasks = data.results || []; setProgress({ total: tasks.length, completed: tasks.filter((task) => task.is_completed).length }) }) }, [refreshVersion])
  const percentage = progress.total ? Math.round(progress.completed / progress.total * 100) : 0
  return <div className="progress"><div><strong>{percentage}%</strong><span>{progress.completed} de {progress.total} concluídas</span></div><div className="progress-track"><span style={{ width: `${percentage}%` }} /></div></div>
}
