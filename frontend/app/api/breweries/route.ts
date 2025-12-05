import { cookies } from 'next/headers'

const BREWERIES_BASE = process.env.BREWERIES_SERVICE_URL || 'http://localhost:3001'
const BASE = `${BREWERIES_BASE}/breweries`

export async function GET(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
        return Response.json({ detail: 'unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const country = searchParams.get('country')

    let url = BASE
    if (type === 'random') {
        url = `${BASE}/random`
    } else if (country) {
        url = `${BASE}/country/${encodeURIComponent(country)}`
    }

    try {
        const r = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const json = await r.json().catch(() => ({}))
        return Response.json(json, { status: r.status })
    } catch (e) {
        return Response.json({ detail: 'breweries service unreachable' }, { status: 503 })
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
        return Response.json({ detail: 'unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        const r = await fetch(BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        const json = await r.json().catch(() => ({}))
        return Response.json(json, { status: r.status })
    } catch (e) {
        return Response.json({ detail: 'create failed' }, { status: 500 })
    }
}
