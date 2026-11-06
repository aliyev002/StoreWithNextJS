import prisma from '@/lib/prisma'
import ProductDetailClient from './ProductDetailClient'

export async function generateMetadata({ params }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id: Number(id) } })
  return {
    title: product ? `${product.name} | Mağaza` : 'Məhsul tapılmadı',
  }
}

export default async function ProductDetail({ params }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  })

  if (!product) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Məhsul tapılmadı.
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}
