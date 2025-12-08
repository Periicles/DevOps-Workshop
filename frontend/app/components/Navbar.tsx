'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()

    const handleLogout = async () => {
        // Call logout API or clear session
        await fetch('/api/logout', { method: 'POST' }).catch(() => { })
        window.location.href = '/'
    }

    // Don't show navbar on login page
    if (pathname === '/') return null

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        <Link
                            href="/dashboard"
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === '/dashboard'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Commandes
                        </Link>
                        <Link
                            href="/breweries"
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === '/breweries'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Brasseries
                        </Link>
                        <Link
                            href="/breweries/favoris"
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === '/breweries/favoris'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Favoris
                        </Link>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    )
}
