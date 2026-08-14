import { useAuth } from "../auth/AuthContext"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"
import CategoryForm from "../components/CategoryForm"
import { useState } from "react"

export default function DashboardPage() {
  const { logout } = useAuth()
  const [tasksVersion, setTasksVersion] = useState(0)
  const [categoriesVersion, setCategoriesVersion] = useState(0)

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <button onClick={logout}>Sair</button>
      </header>
      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "2fr 1fr" }}>
        <div>
          <TaskForm
            categoriesVersion={categoriesVersion}
            onTaskCreated={() => setTasksVersion((version) => version + 1)}
          />
          <TaskList refreshVersion={tasksVersion} />
        </div>
        <div>
          <CategoryForm onCategoryCreated={() => setCategoriesVersion((version) => version + 1)} />
        </div>
      </div>
    </div>
  )
}
