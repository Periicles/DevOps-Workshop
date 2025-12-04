import { allAsync, getAsync, runAsync } from '../db/database'
import { Brewery } from '../types'

export class FavoritesService {
    /**
     * Add a brewery to user's favorites
     */
    public async addToFavorites(userId: string, brewery: Brewery): Promise<void> {
        try {
            await runAsync(
                `INSERT OR REPLACE INTO users_favorites (user_id, brewery_id, brewery_data)
         VALUES (?, ?, ?)`,
                [userId, brewery.id, JSON.stringify(brewery)]
            )
        } catch (error) {
            console.error('Error adding to favorites:', error)
            throw new Error('Failed to add brewery to favorites')
        }
    }

    /**
     * Remove a brewery from user's favorites
     */
    public async removeFromFavorites(userId: string, breweryId: string): Promise<void> {
        try {
            await runAsync(
                `DELETE FROM users_favorites WHERE user_id = ? AND brewery_id = ?`,
                [userId, breweryId]
            )
        } catch (error) {
            console.error('Error removing from favorites:', error)
            throw new Error('Failed to remove brewery from favorites')
        }
    }

    /**
     * Get all favorites for a user
     */
    public async getFavorites(userId: string): Promise<Brewery[]> {
        try {
            const rows = await allAsync(
                `SELECT brewery_data FROM users_favorites
         WHERE user_id = ?
         ORDER BY created_at DESC`,
                [userId]
            )
            return rows.map(row => JSON.parse(row.brewery_data))
        } catch (error) {
            console.error('Error fetching favorites:', error)
            throw new Error('Failed to fetch favorites')
        }
    }

    /**
     * Check if a brewery is in user's favorites
     */
    public async isFavorite(userId: string, breweryId: string): Promise<boolean> {
        try {
            const row = await getAsync(
                `SELECT 1 FROM users_favorites
         WHERE user_id = ? AND brewery_id = ?
         LIMIT 1`,
                [userId, breweryId]
            )
            return row !== undefined
        } catch (error) {
            console.error('Error checking favorite:', error)
            return false
        }
    }

    /**
     * Get count of user's favorites
     */
    public async getFavoritesCount(userId: string): Promise<number> {
        try {
            const row = await getAsync(
                `SELECT COUNT(*) as count FROM users_favorites WHERE user_id = ?`,
                [userId]
            )
            return row?.count || 0
        } catch (error) {
            console.error('Error getting favorites count:', error)
            return 0
        }
    }
}
