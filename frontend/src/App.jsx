import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import AmbientScene from "./components/AmbientScene"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  const appRef = useRef(null)
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(".reveal", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: "power3.out" })
    }, appRef)
    return () => context.revert()
  }, [])

  return (
    <AuthProvider>
      <AmbientScene />
      <main ref={appRef} className="app-shell"><AppRoutes /></main>
    </AuthProvider>
  )
}
