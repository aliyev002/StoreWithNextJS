import prisma from '@/lib/prisma'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const inStock = searchParams.get('inStock')

  const where = {}

  if (category) {
    where.category = category
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { desc: { contains: search } },
    ]
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  if (inStock === 'true') {
    where.stock = { gt: 0 }
  }

  let orderBy = { id: 'desc' }
  if (sort === 'price_asc') {
    orderBy = { price: 'asc' }
  } else if (sort === 'price_desc') {
    orderBy = { price: 'desc' }
  } else if (sort === 'newest') {
    orderBy = { createdAt: 'desc' }
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      reviews: {
        select: { rating: true }
      }
    }
  })

  // Format with average rating and reviews count
  const formatted = products.map(p => {
    const totalRating = p.reviews.reduce((sum, r) => sum + r.rating, 0)
    const avgRating = p.reviews.length > 0 ? (totalRating / p.reviews.length).toFixed(1) : null
    return {
      ...p,
      avgRating: avgRating ? parseFloat(avgRating) : null,
      reviewsCount: p.reviews.length,
      reviews: undefined
    }
  })

  return Response.json(formatted)
}
