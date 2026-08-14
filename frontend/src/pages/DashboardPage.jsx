import { useState } from "react"
import { useAuth } from "../auth/AuthContext"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"
import CategoryForm from "../components/CategoryForm"

export default function DashboardPage() {
  const { logout } = useAuth(); const [tasksVersion, setTasksVersion] = useState(0); const [categoriesVersion, setCategoriesVersion] = useState(0)
  return <div className="dashboard"><header className="topbar reveal"><div><span className="eyebrow">painel pessoal</span><h1>Seu foco, organizado.</h1></div><button onClick={logout}>Sair</button></header><div className="dashboard-grid"><div><section className="panel reveal"><TaskForm categoriesVersion={categoriesVersion} onTaskCreated={() => setTasksVersion((v) => v + 1)} /></section><section className="panel reveal"><TaskList refreshVersion={tasksVersion} /></section></div><section className="panel reveal"><CategoryForm onCategoryCreated={() => setCategoriesVersion((v) => v + 1)} /></section></div></div>
}
