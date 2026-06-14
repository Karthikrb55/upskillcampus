import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios.get('/api/posts').then(r => setPosts(r.data)).catch(() => {})
  }, [])

  const published = posts.filter(p => p.published).length
  const drafts = posts.length - published

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, {user?.name || 'Editor'} 👋</h2>
      <p className="text-gray-500 text-sm mb-6">Here's what's happening with your content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Posts', value: posts.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Published', value: published, color: 'bg-green-50 text-green-700' },
          { label: 'Drafts', value: drafts, color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Recent Posts</h3>
        <Link to="/posts/new" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {posts.slice(0, 5).map(p => (
          <div key={p._id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-medium text-gray-800 text-sm">{p.title || 'Untitled'}</p>
              <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {p.published ? 'Published' : 'Draft'}
              </span>
              <Link to={`/posts/${p._id}/edit`} className="text-indigo-500 text-xs hover:underline">Edit</Link>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No posts yet. <Link to="/posts/new" className="text-indigo-500 hover:underline">Create one</Link>.</p>
        )}
      </div>
    </div>
  )
}
