import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function PostList() {
  const [posts, setPosts] = useState([])

  const load = () => axios.get('/api/posts').then(r => setPosts(r.data)).catch(() => {})
  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return
    await axios.delete(`/api/posts/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Posts</h2>
        <Link to="/posts/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          + New Post
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Title</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map(p => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{p.title || 'Untitled'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right space-x-3">
                  <Link to={`/posts/${p._id}/edit`} className="text-indigo-500 hover:underline">Edit</Link>
                  <button onClick={() => remove(p._id)} className="text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No posts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
