import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/auth'

const BREWERIES_SERVICE_URL = process.env.BREWERIES_SERVICE_URL || 'http://localhost:3001'

/**
 * DELETE /api/favorites/[breweryId]
 * Supprime une brasserie des favoris
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ breweryId: string }> }
) {
    try {
        const token = await getAccessToken()

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { breweryId } = await params

        if (!breweryId) {
            return NextResponse.json(
                { error: 'breweryId is required' },
                { status: 400 }
            )
        }

        const response = await fetch(`${BREWERIES_SERVICE_URL}/favorites/${breweryId}`, {
            method: 'DELETE',
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
        console.error('Error removing from favorites:', error)
        return NextResponse.json(
            { error: 'Failed to remove from favorites' },
            { status: 500 }
        )
    }
}

/**
 * GET /api/favorites/[breweryId]/check
 * Vérifie si une brasserie est dans les favoris
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ breweryId: string }> }
) {
    try {
        const token = await getAccessToken()

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { breweryId } = await params

        if (!breweryId) {
            return NextResponse.json(
                { error: 'breweryId is required' },
                { status: 400 }
            )
        }

        const response = await fetch(`${BREWERIES_SERVICE_URL}/favorites/${breweryId}/check`, {
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
        console.error('Error checking favorite:', error)
        return NextResponse.json(
            { error: 'Failed to check favorite' },
            { status: 500 }
        )
    }
}
