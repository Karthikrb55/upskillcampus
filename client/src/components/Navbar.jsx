import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
      <div className="text-sm text-gray-500">👤 {user?.name || user?.email}</div>
    </header>
  )
}
