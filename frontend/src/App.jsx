import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
