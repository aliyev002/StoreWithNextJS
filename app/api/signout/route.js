import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('token', '', { maxAge: 0, path: '/' })
  return NextResponse.redirect(new URL('/products', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
}
