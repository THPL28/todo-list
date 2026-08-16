import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { fetchMe } from "../auth/api"
import TaskList from "../components/TaskList"
import TaskForm from "../components/TaskForm"
import CategoryForm from "../components/CategoryForm"
import KanbanBoard from "../components/KanbanBoard"
import { fetchTasks } from "../services/tasks"
import { fetchCategories } from "../services/categories"

export default function DashboardPage() {
  const { logout } = useAuth()
  const [tasksVersion, setTasksVersion] = useState(0)
  const [categoriesVersion, setCategoriesVersion] = useState(0)
  const [activeTab, setActiveTab] = useState("inbox")
  const [me, setMe] = useState(null)
  const [sidebarCategories, setSidebarCategories] = useState([])

  // Generate today's date dynamically
  const today = new Date()
  const day = today.getDate()
  const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]
  const month = monthNames[today.getMonth()]

  useEffect(() => {
    fetchMe().then(setMe).catch(() => {})
  }, [])

  useEffect(() => {
    fetchCategories()
      .then((data) => setSidebarCategories(data.results || []))
      .catch(() => {})
  }, [categoriesVersion])

  // Build avatar initials from username
  const initials = me?.username
    ? me.username.slice(0, 2).toUpperCase()
    : "??"

  return (
    <div className="workspace">
      {/* Visually hidden h1 for accessibility and Selenium compatibility */}
      <h1 className="sr-only">Todo List — Dashboard</h1>

      {/* Left Sidebar */}
      <aside className="sidebar reveal">
        <div>
          {/* Logo Section */}
          <div className="logo-section">
            <div className="logo-icon"></div>
            <h2>Todo List</h2>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <h3>{me?.username ?? "Carregando..."}</h3>
              <p>{me?.email ?? ""}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            <a
              href="#inbox"
              className={`nav-item ${activeTab === "inbox" ? "active" : ""}`}
              onClick={() => setActiveTab("inbox")}
            >
              <span className="nav-item-icon"></span>
              Inbox
            </a>
            <a
              href="#today"
              className={`nav-item ${activeTab === "today" ? "active" : ""}`}
              onClick={() => setActiveTab("today")}
            >
              <span className="nav-item-icon"></span>
              Today
            </a>
            <a
              href="#next7"
              className={`nav-item ${activeTab === "next7" ? "active" : ""}`}
              onClick={() => setActiveTab("next7")}
            >
              <span className="nav-item-icon"></span>
              Next 7 days
            </a>
          </nav>

          {/* Categories from API */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span>CATEGORIAS</span>
            </div>
            <div className="sidebar-section-list">
              {sidebarCategories.length === 0 && (
                <div className="sidebar-section-item" style={{ color: "#645e89", fontStyle: "italic" }}>
                  Nenhuma categoria
                </div>
              )}
              {sidebarCategories.map((cat) => (
                <div key={cat.id} className="sidebar-section-item">{cat.name}</div>
              ))}
            </div>
          </div>

          {/* Labels & Filters Headers */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span>LABELS</span>
              <span>+</span>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span>FILTRES</span>
              <span>+</span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={logout}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#a29dbd"
            }}
          >
            Sair
          </button>
        </div>

        {/* Ambient bottom wave glow decoration */}
        <div className="sidebar-wave"></div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard">
        {/* Top Search bar / Quick Find */}
        <header className="dashboard-topbar reveal">
          <div className="search-bar">
            <input placeholder="Quick Find..." aria-label="Search" />
          </div>
          <div className="topbar-actions">
            <span className="action-icon" title="Nova Tarefa">+</span>
            <span className="action-icon" title="Notificações">🔔</span>
            <span className="action-icon" title="Configurações">⚙️</span>
          </div>
        </header>

        {/* Todays Tasks progress banner */}
        <section className="progress-card reveal">
          <div className="date-badge">
            <div className="date-day">{day}</div>
            <div className="date-month">{month}</div>
          </div>
          <TaskProgress refreshVersion={tasksVersion} />
        </section>

        {/* Kanban Section */}
        <div id="kanban" className="reveal" style={{ marginBottom: "1.5rem" }}>
          <KanbanBoard refreshVersion={tasksVersion} />
        </div>

        {/* Forms and Lists Grid */}
        <div className="dashboard-grid">
          <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
            <section className="panel reveal">
              <TaskForm categoriesVersion={categoriesVersion} onTaskCreated={() => setTasksVersion((v) => v + 1)} />
            </section>
            <section className="panel reveal">
              <CategoryForm onCategoryCreated={() => setCategoriesVersion((v) => v + 1)} />
            </section>
          </div>

          <section className="panel reveal">
            <TaskList
              refreshVersion={tasksVersion}
              onTaskDeleted={() => setTasksVersion((v) => v + 1)}
              onTaskUpdated={() => setTasksVersion((v) => v + 1)}
            />
          </section>
        </div>
      </main>

      {/* Right Inbox Panel */}
      <aside className="inbox-panel reveal">
        <div className="inbox-header">
          <div className="inbox-header-title">
            <h2>INBOX</h2>
            <span className="inbox-badge">0</span>
          </div>
          <div className="inbox-header-accent"></div>
        </div>

        <div className="inbox-messages-list">
          <p style={{ color: "#645e89", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>
            Nenhuma mensagem no momento.
          </p>
        </div>

        {/* Message Composer */}
        <div className="inbox-composer">
          <input placeholder="destinatário@email.com" aria-label="Email recipient" />
          <textarea placeholder="Escreva uma resposta..." rows={3} aria-label="Message text" />
          <div className="composer-actions">
            <div className="composer-utilities">
              <span style={{ cursor: "pointer" }} title="Anexar arquivo">📎</span>
              <span style={{ cursor: "pointer" }} title="Descartar">🗑️</span>
            </div>
            <button className="composer-btn-send">SEND</button>
          </div>
        </div>
      </aside>
    </div>
  )
}

function TaskProgress({ refreshVersion }) {
  const [progress, setProgress] = useState({ total: 0, completed: 0 })

  useEffect(() => {
    fetchTasks({ page_size: 100 }).then((data) => {
      const tasks = data.results || []
      setProgress({
        total: tasks.length,
        completed: tasks.filter((task) => task.is_completed).length
      })
    }).catch(() => {})
  }, [refreshVersion])

  const percentage = progress.total ? Math.round(progress.completed / progress.total * 100) : 0
  const mustDo = progress.total - progress.completed

  return (
    <div className="progress-info">
      <div className="progress-title-row">
        <h2>Tarefas de Hoje</h2>
        <span className="progress-stats">
          Concluídas: <strong style={{ color: "#38bdf8" }}>{progress.completed}</strong>
          &nbsp;|&nbsp;
          Pendentes: <strong style={{ color: "#a78bfa" }}>{mustDo}</strong>
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
