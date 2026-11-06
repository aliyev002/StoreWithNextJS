import prisma from '@/lib/prisma'
import { getUserFromCookie } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Get all products for admin
export async function GET() {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'İcazə verilmədi' }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' }
  })

  return NextResponse.json(products)
}

// Create new product
export async function POST(req) {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'İcazə verilmədi' }, { status: 403 })
  }

  try {
    const data = await req.json()
    const { name, desc, price, category, imageUrl, stock, variants, images } = data

    if (!name || !price || !category || !imageUrl) {
      return NextResponse.json({ error: 'Zəruri xanaları doldurun' }, { status: 400 })
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        desc: desc || '',
        price: parseFloat(price),
        category,
        imageUrl,
        stock: parseInt(stock) || 10,
        variants: variants ? (typeof variants === 'string' ? variants : JSON.stringify(variants)) : null,
        images: images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null,
      }
    })

    return NextResponse.json({ message: 'Məhsul yaradıldı', product: newProduct })
  } catch (error) {
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 })
  }
}

// Update existing product
export async function PUT(req) {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'İcazə verilmədi' }, { status: 403 })
  }

  try {
    const data = await req.json()
    const { id, name, desc, price, category, imageUrl, stock, variants, images } = data

    if (!id) {
      return NextResponse.json({ error: 'Məhsul ID tələb olunur' }, { status: 400 })
    }

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        desc,
        price: parseFloat(price),
        category,
        imageUrl,
        stock: parseInt(stock) || 0,
        variants: variants ? (typeof variants === 'string' ? variants : JSON.stringify(variants)) : null,
        images: images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null,
      }
    })

    return NextResponse.json({ message: 'Məhsul yeniləndi', product: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Yeniləmə xətası' }, { status: 500 })
  }
}

// Delete product
export async function DELETE(req) {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'İcazə verilmədi' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Məhsul ID tələb olunur' }, { status: 400 })
    }

    const numId = Number(id)

    // Delete related reviews and wishlists first
    await prisma.review.deleteMany({ where: { productId: numId } })
    await prisma.wishlist.deleteMany({ where: { productId: numId } })
    await prisma.orderItem.deleteMany({ where: { productId: numId } })

    await prisma.product.delete({ where: { id: numId } })

    return NextResponse.json({ message: 'Məhsul uğurla silindi' })
  } catch (error) {
    return NextResponse.json({ error: 'Silinmə xətası' }, { status: 500 })
  }
}
