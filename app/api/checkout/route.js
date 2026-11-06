import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'magaza_super_secret_jwt_key_2025_xK9mP3qR'

export async function POST(req) {
  try {
    const { name, address, phone, cart, paymentMethod = 'cash', couponCode = '' } = await req.json()

    const cookieHeader = req.headers.get('cookie') || ''
    const cookiesObj = Object.fromEntries(
      cookieHeader.split('; ').filter(Boolean).map(c => {
        const idx = c.indexOf('=')
        return [c.slice(0, idx), c.slice(idx + 1)]
      })
    )
    const token = cookiesObj.token

    if (!token) {
      return NextResponse.json({ error: 'Sifariş üçün giriş tələb olunur' }, { status: 401 })
    }

    let userId
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      userId = decoded.id
    } catch (err) {
      return NextResponse.json({ error: 'Token yanlışdır və ya vaxtı bitib' }, { status: 401 })
    }

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Səbət boşdur' }, { status: 400 })
    }

    // 1. Check stock for each product
    for (const item of cart) {
      const dbProduct = await prisma.product.findUnique({ where: { id: item.id } })
      if (!dbProduct) {
        return NextResponse.json({ error: `Məhsul tapılmadı: ${item.name}` }, { status: 400 })
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({
          error: `"${dbProduct.name}" məhsulundan kifayət qədər stok yoxdur (Qalıq: ${dbProduct.stock} ədəd).`
        }, { status: 400 })
      }
    }

    // 2. Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)

    // 3. Check Coupon
    let discount = 0
    if (couponCode.trim()) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() }
      })
      if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountPercent) {
          discount = (subtotal * coupon.discountPercent) / 100
        } else if (coupon.discountAmount) {
          discount = Math.min(coupon.discountAmount, subtotal)
        }
      }
    }

    const delivery = subtotal >= 50 ? 0 : 5
    const total = Math.max(0, subtotal - discount) + delivery

    // 4. Create Order & Update stocks in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of cart) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity || 1 } }
        })
      }

      // Create order
      return await tx.order.create({
        data: {
          userId,
          name,
          address,
          phone,
          status: 'pending',
          paymentMethod,
          discount,
          total,
          items: {
            create: cart.map(item => ({
              productId: item.id,
              quantity: item.quantity || 1,
              price: item.price,
              variant: item.variant || null
            }))
          }
        },
        include: { items: true }
      })
    })

    return NextResponse.json({
      message: 'Sifariş uğurla tamamlandı.',
      orderId: order.id,
      total: order.total
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Sifariş zamanı daxili server xətası baş verdi' }, { status: 500 })
  }
}
