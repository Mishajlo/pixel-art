import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/auth'
import pictureRoutes from './routes/pictures'
import { AppDataSource } from './database'
import { setupSocket } from './socket'
import path from 'path'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', "PUT", 'DELETE', 'PATCH'],
    credentials: true,
  },
})

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', "PUT", 'DELETE', 'PATCH'],
  }),
)

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/pictures', pictureRoutes)

/*app.use(express.static(path.join('/app/src/src/aplikacija')))
app.get('*', (req, res) => {
  res.sendFile(path.join('/app/src/src/aplikacija', 'index.html'))
})*/


AppDataSource.initialize()
  .then(() => {
    console.log('Baza povezana')
    setupSocket(io)

    console.log(__dirname)

    httpServer.listen(3001, () => {
      console.log('Server radi na http://localhost:3001')
    })
  })
  .catch(greska => console.error('Greska pri povezivanju s bazom:', greska))
