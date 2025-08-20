"use client"
import { useEffect, useState } from "react"

export default function Home() {
  const [todos, setTodos] = useState<any[]>([])
  const [title, setTitle] = useState("")

  // ambil data dari API
  useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
  }, [])

  // tambah todo
  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    })
    setTitle("")
    location.reload()
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">📌 Todo App</h1>

      <form onSubmit={addTodo} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah todo baru..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

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
