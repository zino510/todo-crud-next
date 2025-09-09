import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// ✅ GET todo by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await pool.query('SELECT * FROM "Todo" WHERE id=$1', [id])
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Todo not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ PUT update todo (done / title)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { title, done } = await req.json()

    if (title !== undefined) {
      await pool.query('UPDATE "Todo" SET title=$1 WHERE id=$2', [title, id])
    }
    if (done !== undefined) {
      await pool.query('UPDATE "Todo" SET done=$1 WHERE id=$2', [done, id])
    }

    return NextResponse.json({ success: true, message: 'Todo updated' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ DELETE todo by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await pool.query('DELETE FROM "Todo" WHERE id=$1', [id])
    return NextResponse.json({ success: true, message: 'Todo deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
