import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// ✅ GET semua todo
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM "Todo" ORDER BY "createdAt" DESC'
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ POST tambah todo baru
export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json()
    if (!title || title.trim() === '') {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }

    const id = uuidv4()
    await pool.query(
      'INSERT INTO "Todo" (id, title, done, "createdAt") VALUES ($1, $2, false, NOW())',
      [id, title.trim()]
    )

    return NextResponse.json({ success: true, message: 'Todo created', id }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
