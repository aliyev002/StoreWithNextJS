import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromCookie()
    if (!user) {
      return NextResponse.json({ error: 'Giriş tələb olunur' }, { status: 401 })
    }

    const { id } = await params
    const orderId = Number(id)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Yanlış sifariş ID' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })

    if (!order || (order.userId !== user.id && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Sifariş tapılmadı və ya icazəniz yoxdur' }, { status: 404 })
    }

    // Stokun bərpası
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      }).catch(() => {})
    }

    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    return NextResponse.json({ message: 'Sifariş uğurla ləğv edildi' })
  } catch (error) {
    console.error('Delete order error:', error)
    return NextResponse.json({ error: 'Sifariş silinərkən daxili server xətası baş verdi' }, { status: 500 })
  }
}
