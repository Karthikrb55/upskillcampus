import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useEffect } from 'react'
import axios from 'axios'

export default function RichEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value])

  const insertImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await axios.post('/api/upload', fd)
    editor.chain().focus().setImage({ src: data.url }).run()
  }

  if (!editor) return null
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b text-sm">
        {[
          ['Bold', () => editor.chain().focus().toggleBold().run()],
          ['Italic', () => editor.chain().focus().toggleItalic().run()],
          ['Strike', () => editor.chain().focus().toggleStrike().run()],
          ['H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
          ['H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run()],
          ['• List', () => editor.chain().focus().toggleBulletList().run()],
          ['1. List', () => editor.chain().focus().toggleOrderedList().run()],
          ['Code', () => editor.chain().focus().toggleCodeBlock().run()],
        ].map(([label, fn]) => (
          <button key={label} type="button" onClick={fn}
            className="px-2 py-1 rounded hover:bg-gray-200 font-medium">
            {label}
          </button>
        ))}
        <label className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer font-medium">
          🖼 Image<input type="file" accept="image/*" className="hidden" onChange={insertImage} />
        </label>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-48 focus:outline-none" />
    </div>
  )
}
