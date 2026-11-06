import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Get reviews for a specific product
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'Məhsul ID tələb olunur' }, { status: 400 })
  }

  const reviews = await prisma.review.findMany({
    where: { productId: Number(productId) },
    include: {
      user: {
        select: { id: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(reviews)
}

// Add a new review
export async function POST(req) {
  const user = await getUserFromCookie()
  if (!user) {
    return NextResponse.json({ error: 'Rəy bildirmək üçün daxil olmalısınız' }, { status: 401 })
  }

  const { productId, rating, comment } = await req.json()

  if (!productId || !comment || !comment.trim()) {
    return NextResponse.json({ error: 'Məhsul və rəy mətni tələb olunur' }, { status: 400 })
  }

  const parsedRating = Math.max(1, Math.min(5, Number(rating) || 5))

  const newReview = await prisma.review.create({
    data: {
      userId: user.id,
      productId: Number(productId),
      rating: parsedRating,
      comment: comment.trim()
    },
    include: {
      user: { select: { email: true } }
    }
  })

  return NextResponse.json({
    message: 'Rəyiniz uğurla əlavə edildi',
    review: newReview
  })
}
