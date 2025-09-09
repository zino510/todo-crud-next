"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Definisi tipe todo
interface Todo {
  id: string
  title: string
  done: boolean
  createdat: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  // Fetch data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchTodos()
  }, [])

  // Ambil data todos dari API
  async function fetchTodos() {
    const res = await fetch("/api/todos")
    const data = await res.json()
    setTodos(data.success ? data.data : data)
  }

  // Tambah todo baru
  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    if (!confirm("Yakin ingin menambahkan todo baru?")) return
    setLoading(true)
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    })
    setTitle("")
    await fetchTodos()
    setLoading(false)
  }

  // Toggle todo selesai / belum
  async function toggleTodo(id: string, done: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ done: !done }),
      headers: { "Content-Type": "application/json" },
    })
    await fetchTodos()
  }

  // Hapus todo
  async function deleteTodo(id: string) {
    if (!confirm("Apakah kamu yakin ingin menghapus todo ini?")) return
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    })
    await fetchTodos()
  }

  // Simpan perubahan todo (edit)
  async function saveEdit(id: string) {
    if (!editingTitle.trim()) return
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editingTitle }),
      headers: { "Content-Type": "application/json" },
    })
    setEditingId(null)
    setEditingTitle("")
    await fetchTodos()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8">
        {/* Judul */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
        >
          🚀 Todo App
        </motion.h1>

        {/* Form tambah todo */}
        <motion.form
          onSubmit={addTodo}
          className="flex gap-2 bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tambah todo baru..."
            className="flex-1 border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow-md disabled:opacity-50"
          >
            {loading ? "..." : "Add"}
          </motion.button>
        </motion.form>

        {/* List todo */}
        <ul className="space-y-3">
          <AnimatePresence>
            {todos.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 italic"
              >
                🎉 Belum ada todo, yuk tambahkan!
              </motion.p>
            ) : (
              todos.map((todo) => (
                <motion.li
                  key={todo.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between bg-white/90 backdrop-blur-md border p-3 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  {/* Jika sedang edit */}
                  {editingId === todo.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        saveEdit(todo.id)
                      }}
                      className="flex-1 flex gap-2"
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 border px-2 py-1 rounded-lg"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-green-500 text-white rounded-lg"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null)
                          setEditingTitle("")
                        }}
                        className="px-3 py-1 bg-gray-400 text-white rounded-lg"
                      >
                        Batal
                      </button>
                    </form>
                  ) : (
                    <motion.span
                      onClick={() => toggleTodo(todo.id, todo.done)}
                      className={`cursor-pointer flex-1 text-lg ${
                        todo.done
                          ? "line-through text-gray-400"
                          : "text-gray-800 font-medium"
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {todo.title}
                    </motion.span>
                  )}

                  {/* Tombol aksi */}
                  {editingId !== todo.id && (
                    <div className="flex gap-3 ml-3">
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTodo(todo.id, todo.done)}
                        className="text-green-500 hover:text-green-700"
                      >
                        {todo.done ? "↩️" : "✅"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingId(todo.id)
                          setEditingTitle(todo.title)
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </motion.button>
                    </div>
                  )}
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  )
}
