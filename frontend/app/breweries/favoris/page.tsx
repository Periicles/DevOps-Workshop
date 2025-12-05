'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Brewery {
    id: string
    name: string
    brewery_type: string
    street: string
    city: string
    state: string
    postal_code: string
    country: string
    website_url?: string
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Brewery[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/favorites')

                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Please log in to view your favorites')
                    } else {
                        setError('Failed to load favorites')
                    }
                    return
                }

                const data = await response.json()
                setFavorites(data.data || [])
            } catch (err) {
                console.error('Error fetching favorites:', err)
                setError('An error occurred while loading favorites')
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [])

    const handleRemove = async (breweryId: string) => {
        try {
            const response = await fetch(`/api/favorites/${breweryId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                setError('Failed to remove from favorites')
                return
            }

            setFavorites(favorites.filter(b => b.id !== breweryId))
        } catch (err) {
            console.error('Error removing favorite:', err)
            setError('An error occurred while removing from favorites')
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">My Favorite Breweries</h1>
                    <div className="text-center py-12">Loading...</div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Favorite Breweries</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600 mb-4">You haven&apos;t added any favorites yet.</p>
                        <Link
                            href="/breweries"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Explore Breweries
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favorites.map((brewery) => (
                            <div
                                key={brewery.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <h2 className="text-xl font-semibold mb-2">{brewery.name}</h2>
                                <p className="text-gray-600 mb-2">{brewery.brewery_type}</p>
                                <div className="text-sm text-gray-500 space-y-1 mb-4">
                                    <p>{brewery.street}</p>
                                    <p>
                                        {brewery.city}, {brewery.state} {brewery.postal_code}
                                    </p>
                                    <p>{brewery.country}</p>
                                </div>
                                {brewery.website_url && (
                                    <a
                                        href={brewery.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
                                    >
                                        Visit Website →
                                    </a>
                                )}
                                <button
                                    onClick={() => handleRemove(brewery.id)}
                                    className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                >
                                    Remove from Favorites
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8">
                    <Link
                        href="/breweries"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Breweries
                    </Link>
                </div>
            </div>
        </main>
    )
}
