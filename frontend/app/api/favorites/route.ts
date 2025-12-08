import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/auth'

const FAVORITES_URL = process.env.BREWERIES_SERVICE_URL

/**
 * GET /api/favorites
 * Récupère tous les favoris de l'utilisateur connecté
 */
export async function GET() {
    try {
        const token = await getAccessToken()

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const response = await fetch(`${FAVORITES_URL}/favorites`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Breweries service error: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching favorites:', error)
        return NextResponse.json(
            { error: 'Failed to fetch favorites' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/favorites
 * Ajoute une brasserie aux favoris
 */
export async function POST(request: NextRequest) {
    try {
        const token = await getAccessToken()

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { breweryId } = body

        if (!breweryId) {
            return NextResponse.json(
                { error: 'breweryId is required' },
                { status: 400 }
            )
        }

        const response = await fetch(`${FAVORITES_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ breweryId }),
        })

        if (!response.ok) {
            throw new Error(`Breweries service error: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error adding to favorites:', error)
        return NextResponse.json(
            { error: 'Failed to add to favorites' },
            { status: 500 }
        )
    }
}
