import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// GET semua todo
export async function GET() {
  const [rows] = await pool.query('SELECT * FROM Todo ORDER BY createdAt DESC')
  return NextResponse.json(rows)
}

// POST tambah todo
export async function POST(req: NextRequest) {
  const { title } = await req.json()
  const id = uuidv4()
  await pool.query('INSERT INTO Todo (id, title, done, createdAt) VALUES (?, ?, false, NOW())', [id, title])
  return NextResponse.json({ ok: true }, { status: 201 })
}

// PUT update status todo
export async function PUT(req: NextRequest) {
  const { id, done } = await req.json()
  await pool.query('UPDATE Todo SET done=? WHERE id=?', [done, id])
  return NextResponse.json({ ok: true })
}

// DELETE hapus todo
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await pool.query('DELETE FROM Todo WHERE id=?', [id])
  return NextResponse.json({ ok: true })
}
