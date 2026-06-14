import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: '🏠 Dashboard' },
  { to: '/posts', label: '📝 Posts' },
  { to: '/posts/new', label: '✏️ New Post' },
]

export default function Sidebar() {
  const { logout, user } = useAuth()
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-5 text-xl font-bold border-b border-gray-700">⚡ CMS</div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        <p className="mb-2 truncate">{user?.email}</p>
        <button onClick={logout} className="text-red-400 hover:text-red-300">Logout</button>
      </div>
    </aside>
  )
}
