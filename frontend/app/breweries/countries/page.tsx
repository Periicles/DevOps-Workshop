"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'

type Brewery = {
    id: string
    name: string
    city?: string
    state?: string
    website_url?: string
}

type Country = {
    name: string
    code: string
}

// Liste de pays la plus utilisée par le service, en attendant une API dédiée
const COUNTRIES: Country[] = [
    { name: 'Australie', code: 'australia' },
    { name: 'France', code: 'france' },
    { name: 'Allemagne', code: 'germany' },
    { name: 'Irlande', code: 'ireland' },
    { name: 'Italie', code: 'italy' },
    { name: 'Japon', code: 'japan' },
    { name: 'Afrique du Sud', code: 'south africa' },
    { name: 'Corée du Sud', code: 'south korea' },
    { name: 'Espagne', code: 'spain' },
    { name: 'Angleterre', code: 'england' },
    { name: 'États-Unis', code: 'united states' },
]

export default function CountriesPage() {
    const [selectedCountryCode, setSelectedCountryCode] = useState('')
    const [searchedCountry, setSearchedCountry] = useState<Country | null>(null)
    const [breweries, setBreweries] = useState<Brewery[]>([])
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [favoritePending, setFavoritePending] = useState<string | null>(null)
    const [favoriteError, setFavoriteError] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        let cancelled = false

        async function checkAuth() {
            try {
                const res = await fetch('/api/breweries')
                if (res.status === 401) {
                    window.location.href = '/'
                    return
                }
                if (!res.ok) {
                    throw new Error(`Auth check failed with status ${res.status}`)
                }
                if (!cancelled) {
                    setIsAuthenticated(true)
                }
            } catch (err) {
                console.error('Authentication failed:', err)
                window.location.href = '/'
                return
            }

            try {
                const favRes = await fetch('/api/favorites')
                if (!favRes.ok) {
                    if (favRes.status === 401) {
                        window.location.href = '/'
                        return
                    }
                    throw new Error(`Favorites fetch failed with status ${favRes.status}`)
                }
                const favData: { data?: Array<{ id: string }> } = await favRes.json()
                const favIds = Array.isArray(favData?.data) ? favData.data.map((item) => item.id) : []
                if (!cancelled) {
                    setFavorites(new Set(favIds))
                }
            } catch {
                console.error('Unable to load favorites for the current user.')
            }
        }
        checkAuth()
        return () => {
            cancelled = true
        }
    }, [])

    async function fetchBreweriesByCountry(country: Country) {
        setLoading(true)
        setError('')
        setFavoriteError('')
        setBreweries([])
        setSearchedCountry(country)

        try {
            const res = await fetch(`/api/breweries?country=${encodeURIComponent(country.code)}`)
            if (res.status === 401) {
                window.location.href = '/'
                return
            }
            if (!res.ok) throw new Error('Failed')
            const data = await res.json()
            setBreweries(Array.isArray(data) ? data : [])
        } catch {
            setError('Impossible de récupérer les brasseries pour ce pays.')
        } finally {
            setLoading(false)
        }
    }

    async function toggleFavorite(brewery: Brewery) {
        setFavoriteError('')
        setFavoritePending(brewery.id)
        try {
            if (favorites.has(brewery.id)) {
                const res = await fetch(`/api/favorites/${brewery.id}`, { method: 'DELETE' })
                if (!res.ok) {
                    throw new Error(`DELETE favorite failed with status ${res.status}`)
                }
                setFavorites((prev) => {
                    const next = new Set(prev)
                    next.delete(brewery.id)
                    return next
                })
            } else {
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ breweryId: brewery.id }),
                })
                if (!res.ok) {
                    throw new Error(`POST favorite failed with status ${res.status}`)
                }
                setFavorites((prev) => {
                    const next = new Set(prev)
                    next.add(brewery.id)
                    return next
                })
            }
        } catch (err) {
            console.error('Favorite toggle failed:', err)
            setFavoriteError('Impossible de mettre à jour les favoris pour cette brasserie.')
        } finally {
            setFavoritePending(null)
        }
    }

    function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const country = COUNTRIES.find((item) => item.code === selectedCountryCode)
        if (!country) {
            setError('Veuillez sélectionner un pays avant de lancer la recherche.')
            setSearchedCountry(null)
            setBreweries([])
            return
        }
        fetchBreweriesByCountry(country)
    }

    function handleCountryChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCountryCode(event.target.value)
        setError('')
    }

    function resetSelection() {
        setSelectedCountryCode('')
        setSearchedCountry(null)
        setBreweries([])
        setError('')
        setFavoriteError('')
    }

    if (isAuthenticated === null) {
        return <p className="p-6 text-gray-600">Chargement…</p>
    }

    return (
        <main className="max-w-3xl mx-auto py-10 px-6">
            <div className="relative flex justify-center items-center mb-8">
                <Link
                    href="/breweries"
                    className="absolute left-0 text-blue-600 hover:text-blue-800 text-3xl"
                >
                    ⬅
                </Link>
                <h1 className="text-2xl font-bold">Rechercher des brasseries par pays</h1>
            </div>

            <section className="bg-white border rounded-2xl shadow-sm p-6 mb-8">
                <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
                    <label htmlFor="country-select" className="text-sm font-semibold text-gray-700">
                        Sélectionner un pays
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                        <select
                            id="country-select"
                            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            value={selectedCountryCode}
                            onChange={handleCountryChange}
                            aria-label="Sélection du pays"
                        >
                            <option value="">-- Choisir un pays --</option>
                            {COUNTRIES.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={!selectedCountryCode || loading}
                        >
                            Lancer la recherche
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Choisissez un pays dans la liste puis lancez la recherche pour récupérer les brasseries correspondantes.
                    </p>
                </form>
            </section>

            {searchedCountry && (
                <section className="mt-10 border rounded-2xl bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Brasseries en {searchedCountry.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Résultats fournis par l’API interne.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={resetSelection}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Effacer la sélection
                        </button>
                    </div>

                    {loading && <p className="text-gray-600">Chargement…</p>}
                    {!loading && error && <p className="text-red-600">{error}</p>}
                    {!loading && favoriteError && !error && (
                        <p className="text-red-600">{favoriteError}</p>
                    )}
                    {!loading && !error && breweries.length === 0 && (
                        <p className="text-gray-500">Aucune brasserie trouvée pour ce pays.</p>
                    )}

                    {!loading && !error && breweries.length > 0 && (
                        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {breweries.map((brewery) => (
                                <li key={brewery.id} className="rounded-xl border border-gray-200 p-4">
                                    <p className="font-semibold text-gray-800">{brewery.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {[brewery.city, brewery.state].filter(Boolean).join(', ')}
                                    </p>
                                    {brewery.website_url && (
                                        <a
                                            href={brewery.website_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Site web
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => toggleFavorite(brewery)}
                                        disabled={favoritePending === brewery.id}
                                        aria-pressed={favorites.has(brewery.id)}
                                        className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${favorites.has(brewery.id)
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            } ${favoritePending === brewery.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {favoritePending === brewery.id
                                            ? 'Patientez…'
                                            : favorites.has(brewery.id)
                                                ? '♥ Retirer des favoris'
                                                : '♡ Ajouter aux favoris'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </main>
    )
}
