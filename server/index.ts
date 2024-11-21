import express from 'express'
import cors from 'cors'
import pg from 'pg'
import { config } from 'dotenv'

config({ 
  path: ['.env.local', '.env'] 
})

const app = express()
const port = 3000

console.log('DB URL:', process.env.DATABASE_URL)

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

app.use(cors())
app.use(express.json())

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// Create post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, excerpt, content } = req.body
    const result = await pool.query(
      'INSERT INTO posts (title, excerpt, content) VALUES ($1, $2, $3) RETURNING *',
      [title, excerpt, content]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// Update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, excerpt, content } = req.body
    const result = await pool.query(
      'UPDATE posts SET title = $1, excerpt = $2, content = $3 WHERE id = $4 RETURNING *',
      [title, excerpt, content, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' })
  }
})

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' })
    }
    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})