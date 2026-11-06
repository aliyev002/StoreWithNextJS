import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Get user's wishlist
export async function GET() {
  const user = await getUserFromCookie()
  if (!user) {
    return NextResponse.json({ error: 'Giriş tələb olunur' }, { status: 401 })
  }

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(wishlistItems.map(item => item.product))
}

// Toggle product in wishlist (add if absent, remove if present)
export async function POST(req) {
  const user = await getUserFromCookie()
  if (!user) {
    return NextResponse.json({ error: 'Giriş tələb olunur' }, { status: 401 })
  }

  const { productId } = await req.json()
  if (!productId) {
    return NextResponse.json({ error: 'Məhsul ID tələb olunur' }, { status: 400 })
  }

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId: Number(productId)
      }
    }
  })

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } })
    return NextResponse.json({ added: false, message: 'İstək siyahısından çıxarıldı' })
  } else {
    await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: Number(productId)
      }
    })
    return NextResponse.json({ added: true, message: 'İstək siyahısına əlavə edildi' })
  }
}
