import { Router } from 'express';
import breweriesController from '../controllers/breweriesController';
import favoritesController from '../controllers/favoritesController';
import healthController from '../controllers/healthController';
import authMiddleware from '../middleware/auth';

export function setBreweryRoutes(app: Router) {
  // Health check - no auth required
  app.get('/health', healthController.health.bind(healthController));

  // Protected brewery routes - require valid JWT
  app.get('/breweries', authMiddleware, breweriesController.fetchBreweries.bind(breweriesController));
  app.get('/breweries/random', authMiddleware, breweriesController.fetchRandomBrewery.bind(breweriesController));
  app.get('/breweries/country/:country', authMiddleware, breweriesController.fetchBreweriesByCountry.bind(breweriesController));

  // Protected favorites routes - require valid JWT
  app.get('/favorites', authMiddleware, favoritesController.getFavorites.bind(favoritesController));
  app.post('/favorites', authMiddleware, favoritesController.addToFavorites.bind(favoritesController));
  app.delete('/favorites/:breweryId', authMiddleware, favoritesController.removeFromFavorites.bind(favoritesController));
  app.get('/favorites/:breweryId/check', authMiddleware, favoritesController.checkFavorite.bind(favoritesController));
}