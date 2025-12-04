import { Request, Response } from 'express'
import { FavoritesService } from '../services/favoritesService'
import { BreweryService } from '../services/breweryService'

export class FavoritesController {
    private favoritesService: FavoritesService
    private breweryService: BreweryService

    constructor() {
        this.favoritesService = new FavoritesService()
        this.breweryService = new BreweryService()
    }

    /**
     * Get all favorites for the authenticated user
     */
    public async getFavorites(req: Request, res: Response) {
        try {
            // @ts-ignore - user attached by auth middleware
            const userId = req.user?.sub || req.user?.id

            if (!userId) {
                return res.status(401).json({ message: 'User ID not found in token' })
            }

            const favorites = await this.favoritesService.getFavorites(userId)
            return res.status(200).json({
                data: favorites,
                count: favorites.length,
            })
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching favorites', error })
        }
    }

    /**
     * Add a brewery to favorites
     */
    public async addToFavorites(req: Request, res: Response) {
        try {
            // @ts-ignore - user attached by auth middleware
            const userId = req.user?.sub || req.user?.id
            const { breweryId } = req.body

            if (!userId) {
                return res.status(401).json({ message: 'User ID not found in token' })
            }

            if (!breweryId) {
                return res.status(400).json({ message: 'breweryId is required' })
            }

            // Fetch brewery data from API
            const brewery = await this.breweryService.getBreweryById(breweryId)

            if (!brewery) {
                return res.status(404).json({ message: 'Brewery not found' })
            }

            await this.favoritesService.addToFavorites(userId, brewery)

            return res.status(201).json({
                message: 'Brewery added to favorites',
                data: brewery,
            })
        } catch (error) {
            return res.status(500).json({ message: 'Error adding to favorites', error })
        }
    }

    /**
     * Remove a brewery from favorites
     */
    public async removeFromFavorites(req: Request, res: Response) {
        try {
            // @ts-ignore - user attached by auth middleware
            const userId = req.user?.sub || req.user?.id
            const { breweryId } = req.params

            if (!userId) {
                return res.status(401).json({ message: 'User ID not found in token' })
            }

            if (!breweryId) {
                return res.status(400).json({ message: 'breweryId is required' })
            }

            const isFavorite = await this.favoritesService.isFavorite(userId, breweryId)

            if (!isFavorite) {
                return res.status(404).json({ message: 'Brewery not in favorites' })
            }

            await this.favoritesService.removeFromFavorites(userId, breweryId)

            return res.status(200).json({ message: 'Brewery removed from favorites' })
        } catch (error) {
            return res.status(500).json({ message: 'Error removing from favorites', error })
        }
    }

    /**
     * Check if a brewery is in favorites
     */
    public async checkFavorite(req: Request, res: Response) {
        try {
            // @ts-ignore - user attached by auth middleware
            const userId = req.user?.sub || req.user?.id
            const { breweryId } = req.params

            if (!userId) {
                return res.status(401).json({ message: 'User ID not found in token' })
            }

            if (!breweryId) {
                return res.status(400).json({ message: 'breweryId is required' })
            }

            const isFavorite = await this.favoritesService.isFavorite(userId, breweryId)

            return res.status(200).json({ isFavorite })
        } catch (error) {
            return res.status(500).json({ message: 'Error checking favorite', error })
        }
    }
}

export default new FavoritesController()
