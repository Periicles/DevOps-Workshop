import sqlite3 from 'sqlite3'
import path from 'path'

// Initialize SQLite database
const dbPath = process.env.DB_PATH || './breweries.db'

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err)
    } else {
        console.log('Connected to SQLite database at:', dbPath)
        // Initialize schema after connecting
        initializeDatabase()
    }
})

// Set database to serialized mode for sequential operations
db.configure('busyTimeout', 5000)

/**
 * Helper to run queries with promises
 */
export const runAsync = (query: string, params: any[] = []): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}

/**
 * Helper to get single row
 */
export const getAsync = (query: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err)
            else resolve(row)
        })
    })
}

/**
 * Helper to get all rows
 */
export const allAsync = (query: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows || [])
        })
    })
}

/**
 * Initialize database schema
 */
export function initializeDatabase() {
    db.serialize(() => {
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
            if (err) console.error('Error enabling foreign keys:', err)
        })

        // Create users_favorites table
        db.run(
            `CREATE TABLE IF NOT EXISTS users_favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        brewery_id TEXT NOT NULL,
        brewery_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, brewery_id)
      )`,
            (err) => {
                if (err) console.error('Error creating users_favorites table:', err)
            }
        )

        // Create index for user_id
        db.run(
            `CREATE INDEX IF NOT EXISTS idx_user_favorites ON users_favorites(user_id)`,
            (err) => {
                if (err) console.error('Error creating idx_user_favorites:', err)
            }
        )

        // Create index for brewery_id
        db.run(
            `CREATE INDEX IF NOT EXISTS idx_brewery_favorites ON users_favorites(brewery_id)`,
            (err) => {
                if (err) console.error('Error creating idx_brewery_favorites:', err)
            }
        )

        // Create brewery_cache table
        db.run(
            `CREATE TABLE IF NOT EXISTS brewery_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brewery_id TEXT UNIQUE NOT NULL,
        brewery_data TEXT NOT NULL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
            (err) => {
                if (err) console.error('Error creating brewery_cache table:', err)
            }
        )

        // Create index for brewery_cache
        db.run(
            `CREATE INDEX IF NOT EXISTS idx_brewery_cache ON brewery_cache(brewery_id)`,
            (err) => {
                if (err) console.error('Error creating idx_brewery_cache:', err)
                else console.log('Database schema initialized successfully')
            }
        )
    })
}

export default db
