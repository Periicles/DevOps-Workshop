import { cookies } from 'next/headers'

const BREWERIES_SERVICE_URL = process.env.BREWERIES_SERVICE_URL;

export async function GET(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
        return Response.json({ detail: 'unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const country = searchParams.get('country')

    let url = `${BREWERIES_SERVICE_URL}/breweries`
    if (type === 'random') {
        url = `${BREWERIES_SERVICE_URL}/breweries/random`
    } else if (country) {
        url = `${BREWERIES_SERVICE_URL}/breweries/country/${encodeURIComponent(country)}`
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

        const r = await fetch(`${BREWERIES_SERVICE_URL}/breweries`, {
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
