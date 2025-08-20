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
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">📌 Todo App</h1>

      {/* Form tambah todo */}
      <form onSubmit={addTodo} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah todo baru..."
          className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 transition text-white px-4 py-2 rounded shadow"
        >
          {loading ? "..." : "Add"}
        </button>
      </form>

      {/* List todo */}
      <ul className="space-y-2">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between border p-2 rounded bg-white shadow-sm"
            >
              <span
                onClick={() => toggleTodo(todo.id, todo.done)}
                className={`cursor-pointer flex-1 ${
                  todo.done ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTodo(todo.id, todo.done)}
                  className="text-green-500 hover:text-green-700"
                >
                  {todo.done ? "↩️" : "✅"}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
