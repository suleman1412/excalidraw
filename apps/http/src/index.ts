import express, { Application, Request, Response } from 'express';
import authRouter from './authRouter';
import roomRouter from './roomRouter';
import authenticateToken from './middleware';
import { chatRouter } from './chatRouter';
import cors from 'cors'

export const app: Application = express()

app.use(cors({
  origin: 'http://localhost:3000', 
}))

app.use(express.json())
app.use('/api/auth/', authRouter)
app.use('/api/room/', authenticateToken, roomRouter)
app.use('/api/chat/', authenticateToken, chatRouter)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Excalidraw - Health Check!' })
})

