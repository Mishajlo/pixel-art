import express from 'express'
import path from 'path'
const app = express()
const PORT = 3000

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/src', express.static(path.join(__dirname, 'src')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.htlm'))
})

// Start the server
app.listen(PORT, () => {
  console.log(`Frontend is running at http://localhost:${PORT}`)
})
