import dotenv from 'dotenv'
import express from 'express'
import { setBreweryRoutes } from './routes/breweries'
import './db/database' // Initialize database
import healthController from './controllers/healthController'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(express.json())

// Health check endpoint (no auth required)
app.get('/health', healthController.health.bind(healthController))

setBreweryRoutes(app)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})