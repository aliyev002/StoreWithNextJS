import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { code, subtotal = 0 } = await req.json()

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Kupon kodu daxil edilməyib' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() }
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Etibarsız və ya vaxtı bitmiş kupon kodu' }, { status: 404 })
    }

    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        error: `Bu kupon üçün minimum sifariş məbləği ${coupon.minOrderAmount} AZN olmalıdır`
      }, { status: 400 })
    }

    let discount = 0
    if (coupon.discountPercent) {
      discount = (subtotal * coupon.discountPercent) / 100
    } else if (coupon.discountAmount) {
      discount = Math.min(coupon.discountAmount, subtotal)
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discount: parseFloat(discount.toFixed(2)),
      message: `${coupon.code} kuponu tətbiq edildi! (${discount.toFixed(2)} AZN endirim)`
    })
  } catch (err) {
    return NextResponse.json({ error: 'Kupon yoxlanılarkən xəta baş verdi' }, { status: 500 })
  }
}
