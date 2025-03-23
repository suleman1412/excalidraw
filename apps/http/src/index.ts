import express from 'express';
import authRouter from './authRouter';
import roomRouter from './roomRouter';
import authenticateToken from './middleware';
import { chatRouter } from './chatRouter';

const app = express()

app.use(express.json())
app.use('/api/auth/', authRouter)
app.use('/api/room/', authenticateToken, roomRouter)
app.use('/api/chat/', authenticateToken, chatRouter)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Excalidraw - Health Check!' })
})


app.listen(8081, () => {
  console.log('Server is running on http://localhost:8081')
})