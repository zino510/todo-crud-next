'use client'

import { useEffect, useState } from 'react'

type Todo = { id: string; title: string; done: number; createdAt: string }

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')

  async function refresh() {
    const res = await fetch('/api/todos', { cache: 'no-store' })
    setTodos(await res.json())
  }

  useEffect(() => { refresh() }, [])

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/todos', { method: 'POST', body: JSON.stringify({ title }) })
    setTitle('')
    refresh()
  }

  async function toggle(id: string, done: number) {
    await fetch('/api/todos', { method: 'PUT', body: JSON.stringify({ id, done: !done }) })
    refresh()
  }

  async function remove(id: string) {
    await fetch('/api/todos', { method: 'DELETE', body: JSON.stringify({ id }) })
    refresh()
  }

  return (
    <main style={{maxWidth:720, margin:'24px auto', fontFamily:'system-ui'}}>
      <h1>Todo CRUD</h1>
      <form onSubmit={addTodo} style={{display:'flex', gap:8}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Tambah todo" required style={{flex:1, padding:8}} />
        <button type="submit">Tambah</button>
      </form>
      <ul style={{listStyle:'none', padding:0}}>
        {todos.map((t)=> (
          <li key={t.id} style={{display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:'1px solid #eee'}}>
            <label style={{display:'flex', alignItems:'center', gap:8, flex:1}}>
              <input type="checkbox" checked={!!t.done} onChange={()=>toggle(t.id,t.done)} />
              <span style={{textDecoration: t.done ? 'line-through' : 'none'}}>{t.title}</span>
            </label>
            <button onClick={()=>remove(t.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
