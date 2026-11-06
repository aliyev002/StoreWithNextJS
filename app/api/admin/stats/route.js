import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'İcazə verilmədi' }, { status: 403 })
  }

  const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  // Calculate total revenue from orders that are not cancelled
  const allOrders = await prisma.order.findMany({
    where: { status: { not: 'cancelled' } },
    select: { total: true }
  })
  const revenue = allOrders.reduce((sum, o) => sum + o.total, 0)

  // Low stock products (less than 5)
  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lte: 5 } },
    take: 5
  })

  return NextResponse.json({
    totalProducts,
    totalOrders,
    totalUsers,
    revenue: parseFloat(revenue.toFixed(2)),
    recentOrders: orders,
    lowStockProducts
  })
}
