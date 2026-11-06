import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'

export async function GET() {
  const user = await getUserFromCookie()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return Response.json(orders)
}
