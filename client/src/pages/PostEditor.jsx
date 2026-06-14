import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import RichEditor from '../components/RichEditor'
import PageBuilder from '../components/PageBuilder'

export default function PostEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [tab, setTab] = useState('editor')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', content: '', coverImage: '', tags: '', published: false, pageBlocks: []
  })

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/posts/${id}`)
        .then(r => setForm({ ...r.data, tags: (r.data.tags || []).join(', ') }))
        .catch(() => navigate('/posts'))
    }
  }, [id])

  const uploadCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await axios.post('/api/upload', fd)
    setForm(f => ({ ...f, coverImage: data.url }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
      if (isEdit) await axios.put(`/api/posts/${id}`, payload)
      else await axios.post('/api/posts', payload)
      navigate('/posts')
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? 'Edit Post' : 'New Post'}</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={submit} className="space-y-5">
        <input
          type="text" placeholder="Post title" required
          className="w-full text-2xl font-semibold border-b-2 border-gray-200 focus:border-indigo-400 focus:outline-none py-2 bg-transparent"
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Cover Image</label>
          <div className="flex items-center gap-4">
            {form.coverImage && <img src={form.coverImage} alt="cover" className="h-20 rounded-lg object-cover" />}
            <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
              Upload Cover<input type="file" accept="image/*" className="hidden" onChange={uploadCover} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tags (comma separated)</label>
          <input
            type="text" placeholder="e.g. tech, design, news"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div>
          <div className="flex gap-4 mb-3 border-b">
            {['editor', 'builder'].map(t => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`pb-2 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>
                {t === 'editor' ? '📝 Rich Editor' : '🧱 Page Builder'}
              </button>
            ))}
          </div>
          {tab === 'editor'
            ? <RichEditor value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} />
            : <PageBuilder blocks={form.pageBlocks} onChange={v => setForm(f => ({ ...f, pageBlocks: v }))} />
          }
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
              className="accent-indigo-600" />
            Publish
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/posts')}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
