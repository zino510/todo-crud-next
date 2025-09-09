  import { Pool } from 'pg'

  export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // wajib di Neon (karena SSL self-signed)
    },
  })
