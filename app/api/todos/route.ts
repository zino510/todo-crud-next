import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { v4 as uuidv4 } from "uuid";


// ✅ GET semua todo
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM "Todo" ORDER BY "createdAt" DESC'
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ POST tambah todo
export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();
    if (!title || title.trim() === '') {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO "Todo" (id, title, done, "createdAt") VALUES ($1, $2, false, NOW())',
      [id, title.trim()]
    );

    return NextResponse.json({ success: true, message: 'Todo created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ PUT update status todo
export async function PUT(req: NextRequest) {
  try {
    const { id, done } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await pool.query('UPDATE "Todo" SET done=$1 WHERE id=$2', [done, id]);
    return NextResponse.json({ success: true, message: 'Todo updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ DELETE hapus todo
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM "Todo" WHERE id=$1', [id]);
    return NextResponse.json({ success: true, message: 'Todo deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
