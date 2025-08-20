"use client"
import { useEffect, useState } from "react"

// definisi tipe todo sesuai database
interface Todo {
  id: string
  title: string
  done: boolean
  createdat: string // field timestamp
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")

  // ambil data todo dari API
  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data: Todo[]) => setTodos(data))
  }, [])

  // tambah todo baru
  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    })

    setTitle("")

    // refresh data setelah tambah
    const res = await fetch("/api/todos")
    const newData: Todo[] = await res.json()
    setTodos(newData)
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">📌 Todo App</h1>

      {/* form tambah todo */}
      <form onSubmit={addTodo} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah todo baru..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* daftar todo */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
