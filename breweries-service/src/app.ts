import dotenv from 'dotenv';
import express from 'express';
import { setBreweryRoutes } from './routes/breweries';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

setBreweryRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});