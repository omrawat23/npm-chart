import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pkg = searchParams.get('package')

  if (!pkg) {
    return NextResponse.json({ error: 'Package name is required' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}`)
    const data = await res.json()

    return NextResponse.json({
      name: data.name,
      description: data.description,
      version: data['dist-tags'].latest,
      homepage: data.homepage
    })
  } catch (error) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 })
  }
}

