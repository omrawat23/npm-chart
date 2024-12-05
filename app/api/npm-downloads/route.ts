import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pkg = searchParams.get('package')
  const until = searchParams.get('until') || new Date().toISOString().split('T')[0]

  if (!pkg) {
    return NextResponse.json({ error: 'Package name is required' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://npm-stat.com/api/download-counts?package=${pkg}&from=2010-01-01&until=${until}`)
    const data = await res.json()

    const downloads = data[pkg] as Record<string, number>

    // Remove first entries with 0
    const filteredDownloads: Record<string, number> = {}
    let foundNonZero = false
    for (const [date, count] of Object.entries(downloads)) {
      if (count > 0 || foundNonZero) {
        filteredDownloads[date] = count
        foundNonZero = true
      }
    }

    return NextResponse.json(filteredDownloads)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch download data' }, { status: 500 })
  }
}

