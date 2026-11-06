import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Get all orders for admin
export async function GET() {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'İcazə verilmədi' }, { status: 403 })
  }

  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      user: { select: { email: true, id: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(orders)
}

// Update order status
export async function PATCH(req) {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'İcazə verilmədi' }, { status: 403 })
  }

  try {
    const { id, status } = await req.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID və status tələb olunur' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status }
    })

    return NextResponse.json({ message: 'Status yeniləndi', order: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Status yenilənmədi' }, { status: 500 })
  }
}
