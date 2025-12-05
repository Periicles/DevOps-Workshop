"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

type Brewery = {
    id: string
    name: string
    city?: string
    state?: string
    website_url?: string
}

export default function CountriesPage() {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [breweries, setBreweries] = useState<Brewery[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    const countries = [
        { name: 'United States', code: 'united states' },
        { name: 'South Korea', code: 'south korea' },
    ]

    // Check authentication on mount
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/breweries')
                if (res.status === 401) {
                    window.location.href = '/'
                    return
                }
                setIsAuthenticated(true)
            } catch {
                window.location.href = '/'
            }
        }
        checkAuth()
    }, [])

    async function fetchBreweriesByCountry(country: string) {
        setLoading(true)
        setError('')
        setSelectedCountry(country)
        try {
            const res = await fetch(`/api/breweries?country=${encodeURIComponent(country)}`)
            if (res.status === 401) {
                window.location.href = '/'
                return
            }
            if (!res.ok) throw new Error('Failed')
            const data = await res.json()
            setBreweries(data || [])
        } catch {
            setError('Could not load breweries')
        } finally {
            setLoading(false)
        }
    }

    function closeModal() {
        setSelectedCountry(null)
        setBreweries([])
        setError('')
    }

    if (isAuthenticated === null) return <p className="p-6 text-gray-600">Chargement…</p>

    return (
        <main className="max-w-2xl mx-auto py-10 px-6">
            <div className="relative flex justify-center items-center mb-6">
                <Link
                    href="/breweries"
                    className="absolute left-0 text-blue-600 hover:text-blue-800 text-3xl"
                >
                    ⬅
                </Link>
                <h1 className="text-2xl font-bold">Brasseries par pays</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {countries.map((country) => (
                    <button
                        key={country.code}
                        onClick={() => fetchBreweriesByCountry(country.code)}
                        className="p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg transition-colors cursor-pointer"
                    >
                        {country.name}
                    </button>
                ))}
            </div>

            {/* Inline country breweries list (no popup) */}
            {selectedCountry && (
                <div className="mt-8 border rounded-xl bg-white shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold">
                            Brasseries - {countries.find(c => c.code === selectedCountry)?.name}
                        </h2>
                        <button
                            onClick={closeModal}
                            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                            aria-label="Fermer la liste"
                        >
                            ✕
                        </button>
                    </div>
                    {loading ? (
                        <p className="text-gray-600">Chargement…</p>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : breweries.length === 0 ? (
                        <p className="text-gray-500">Aucune brasserie trouvée pour ce pays.</p>
                    ) : (
                        <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                            {breweries.map((b) => (
                                <li key={b.id} className="border rounded-lg p-4">
                                    <p className="font-semibold text-gray-800">{b.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {b.city}{b.state ? `, ${b.state}` : ''}
                                    </p>
                                    {b.website_url && (
                                        <a
                                            href={b.website_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Site web
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </main>
    )
}
