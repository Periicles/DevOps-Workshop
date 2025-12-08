'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Brewery {
    id: string
    name: string
    brewery_type: string
    street?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    website_url?: string
}

export default function BreweriesPage() {
    const [breweries, setBreweries] = useState<Brewery[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [randomBrewery, setRandomBrewery] = useState<Brewery | null>(null)
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [countryFilter, setCountryFilter] = useState('')

    // Check authentication and fetch initial breweries
    useEffect(() => {
        async function loadInitialData() {
            try {
                const res = await fetch('/api/breweries')
                if (res.status === 401) {
                    window.location.href = '/'
                    return
                }
                if (!res.ok) throw new Error('Failed to load breweries')

                const data = await res.json()
                setBreweries(Array.isArray(data) ? data : [])

                // Load favorites
                const favRes = await fetch('/api/favorites')
                if (favRes.ok) {
                    const favData = await favRes.json()
                    setFavorites(new Set(favData.data?.map((b: Brewery) => b.id) || []))
                }
            } catch (err) {
                console.error('Error loading data:', err)
                setError('Failed to load breweries')
            } finally {
                setLoading(false)
            }
        }

        loadInitialData()
    }, [])

    async function fetchRandomBrewery() {
        try {
            const res = await fetch('/api/breweries?type=random')
            if (res.status === 401) {
                window.location.href = '/'
                return
            }
            if (!res.ok) throw new Error('Failed')
            const data = await res.json()
            setRandomBrewery(Array.isArray(data) ? data[0] : data)
        } catch {
            setError('Could not load random brewery')
        }
    }

    async function toggleFavorite(brewery: Brewery) {
        try {
            if (favorites.has(brewery.id)) {
                // Remove from favorites
                const res = await fetch(`/api/favorites/${brewery.id}`, {
                    method: 'DELETE',
                })
                if (!res.ok) throw new Error('Failed to remove favorite')
                setFavorites(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(brewery.id)
                    return newSet
                })
            } else {
                // Add to favorites
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ breweryId: brewery.id }),
                })
                if (!res.ok) throw new Error('Failed to add favorite')
                setFavorites(prev => new Set(prev).add(brewery.id))
            }
        } catch (err) {
            console.error('Error toggling favorite:', err)
            setError('Failed to update favorite')
        }
    }

    if (loading && breweries.length === 0) {
        return <div className="p-6 text-center text-gray-600">Loading breweries...</div>
    }

    return (
        <main className="max-w-6xl mx-auto py-10 px-6">
            {/* Header with navigation */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Explorateur de brasseries</h1>
                <Link
                    href="/breweries/favoris"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    ♥ Mes Favoris ({favorites.size})
                </Link>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
                <button
                    onClick={fetchRandomBrewery}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Brasserie aléatoire
                </button>
                <Link
                    href="/breweries/countries"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Listing par pays
                </Link>
            </div>

            {/* Error display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Country filter display */}
            {countryFilter && (
                <div className="mb-4 flex items-center gap-2">
                    <p className="text-gray-600">
                        Showing breweries in: <span className="font-semibold">{countryFilter}</span>
                    </p>
                    <button
                        onClick={() => {
                            setCountryFilter('')
                            setBreweries([])
                            setLoading(true)
                        }}
                        className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Clear Filter
                    </button>
                </div>
            )}

            {/* Random brewery modal */}
            {randomBrewery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-purple-200 p-6">
                        <h3 className="font-bold text-xl text-purple-900 mb-2">{randomBrewery.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{randomBrewery.brewery_type}</p>
                        {randomBrewery.city && (
                            <p className="text-sm text-gray-600 mb-2">
                                {randomBrewery.street && `${randomBrewery.street}, `}
                                {randomBrewery.city}
                                {randomBrewery.state ? `, ${randomBrewery.state}` : ''}
                            </p>
                        )}
                        {randomBrewery.website_url && (
                            <a
                                href={randomBrewery.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-sm text-purple-600 hover:text-purple-800 underline mb-4"
                            >
                                Visit Website →
                            </a>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    toggleFavorite(randomBrewery).then(() => setRandomBrewery(null))
                                }
                                className="flex-1 bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
                            >
                                {favorites.has(randomBrewery.id) ? '♥ In Favorites' : '♡ Add to Favorites'}
                            </button>
                            <button
                                onClick={() => setRandomBrewery(null)}
                                className="flex-1 bg-gray-300 text-gray-800 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Breweries grid */}
            {breweries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">
                        {countryFilter ? 'No breweries found for this country.' : 'No breweries loaded yet.'}
                    </p>
                    {!countryFilter && (
                        <Link
                            href="/breweries/countries"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Browse by Country
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {breweries.map((brewery) => (
                        <div
                            key={brewery.id}
                            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow flex flex-col"
                        >
                            <h3 className="text-lg font-semibold mb-1">{brewery.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{brewery.brewery_type}</p>

                            <div className="text-xs text-gray-500 space-y-1 mb-4 grow">
                                {brewery.street && <p>{brewery.street}</p>}
                                {brewery.city && (
                                    <p>
                                        {brewery.city}
                                        {brewery.state ? `, ${brewery.state}` : ''}
                                    </p>
                                )}
                                {brewery.country && <p>{brewery.country}</p>}
                            </div>

                            {brewery.website_url && (
                                <a
                                    href={brewery.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-xs mb-3 block"
                                >
                                    Visit Website →
                                </a>
                            )}

                            <button
                                onClick={() => toggleFavorite(brewery)}
                                className={`w-full px-3 py-2 rounded-lg font-medium transition-colors ${favorites.has(brewery.id)
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                {favorites.has(brewery.id) ? '♥ Remove' : '♡ Add to Favorites'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
