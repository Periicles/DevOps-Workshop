import { Router } from 'express';
import breweriesController from '../controllers/breweriesController';
import authMiddleware from '../middleware/auth';

export function setBreweryRoutes(app: Router) {
  // Protected routes - require valid JWT
  app.get('/breweries', authMiddleware, breweriesController.fetchBreweries.bind(breweriesController));
  app.get('/breweries/random', authMiddleware, breweriesController.fetchRandomBrewery.bind(breweriesController));
  app.get('/breweries/country/:country', authMiddleware, breweriesController.fetchBreweriesByCountry.bind(breweriesController));
}