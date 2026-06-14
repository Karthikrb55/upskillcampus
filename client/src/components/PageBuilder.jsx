import { useState } from 'react'
import axios from 'axios'

export default function PageBuilder({ blocks = [], onChange }) {
  const [local, setLocal] = useState(blocks)

  const pushChange = (next) => {
    setLocal(next)
    onChange?.(next)
  }

  const addBlock = (type) => {
    const next = [...local, type === 'image' ? { type: 'image', src: '' } : { type: 'text', text: '' }]
    pushChange(next)
  }

  const updateBlock = (idx, patch) => {
    const next = local.map((b, i) => i === idx ? { ...b, ...patch } : b)
    pushChange(next)
  }

  const removeBlock = (idx) => {
    const next = local.filter((_, i) => i !== idx)
    pushChange(next)
  }

  const uploadImage = async (e, idx) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await axios.post('/api/upload', fd)
    updateBlock(idx, { src: data.url })
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => addBlock('text')}
          className="px-3 py-1 bg-indigo-600 text-white rounded">+ Text</button>
        <button type="button" onClick={() => addBlock('image')}
          className="px-3 py-1 bg-green-600 text-white rounded">+ Image</button>
      </div>

      <div className="space-y-4">
        {local.length === 0 && <p className="text-sm text-gray-500">No blocks yet. Add text or image blocks.</p>}
        {local.map((b, i) => (
          <div key={i} className="border rounded p-3 bg-white">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm font-medium">{b.type === 'text' ? 'Text' : 'Image'} block</div>
              <div className="flex gap-2">
                <button type="button" onClick={() => removeBlock(i)} className="text-sm text-red-500">Remove</button>
              </div>
            </div>

            {b.type === 'text' ? (
              <textarea value={b.text} onChange={e => updateBlock(i, { text: e.target.value })}
                className="w-full border rounded p-2 text-sm" rows={4} />
            ) : (
              <div className="flex items-center gap-4">
                {b.src ? <img src={b.src} alt="block" className="h-28 rounded object-cover" /> : <div className="h-28 w-44 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">No image</div>}
                <label className="px-3 py-1 bg-gray-100 rounded cursor-pointer text-sm">
                  Upload<input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, i)} />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
