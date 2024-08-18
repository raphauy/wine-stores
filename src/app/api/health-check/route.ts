import { NextResponse } from 'next/server'

export const maxDuration = 59

export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ data: "ok" })
}