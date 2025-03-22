import express from 'express';
import authRouter from './authRouter';
import authenticateToken from './middleware';

const app = express()

app.use(express.json())
app.use('/auth/', authRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Excalidraw - Health Check!' })
})

app.get('/bruh', authenticateToken, (req, res) => {
  res.json({ message: 'Authenticated route' });
})

app.listen(8081, () => {
  console.log('Server is running on http://localhost:8081')
})