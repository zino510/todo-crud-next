"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// definisi tipe todo
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

  // ambil data
  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const res = await fetch("/api/todos")
    const data: Todo[] = await res.json()
    setTodos(data)
  }

  // tambah todo
  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
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

  // toggle selesai
  async function toggleTodo(id: string, done: boolean) {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id, done: !done }),
      headers: { "Content-Type": "application/json" },
    })
    await fetchTodos()
  }

  // hapus todo
  async function deleteTodo(id: string) {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    })
    await fetchTodos()
  }

  return (
    <div className="max-w-xl mx-auto mt-12 space-y-8">
      {/* Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        🚀 Todo App
      </motion.h1>

      {/* Form tambah todo */}
      <motion.form
        onSubmit={addTodo}
        className="flex gap-2 bg-white/80 backdrop-blur-md shadow-lg p-3 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah todo baru..."
          className="flex-1 border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between bg-white/80 backdrop-blur-md border p-3 rounded-xl shadow-sm"
            >
              {/* Judul todo */}
              <motion.span
                onClick={() => toggleTodo(todo.id, todo.done)}
                className={`cursor-pointer flex-1 text-lg ${
                  todo.done ? "line-through text-gray-400" : "text-gray-800"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {todo.title}
              </motion.span>

              {/* Tombol aksi */}
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
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </motion.button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
