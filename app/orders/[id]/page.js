import { getUserFromCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import OrderDetailClient from './OrderDetailClient'

export default async function OrderDetailPage({ params }) {
  const user = await getUserFromCookie()
  if (!user) redirect('/signin')

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: { include: { product: true } } },
  })

  if (!order || (order.userId !== user.id && user.role !== 'admin')) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
        <h2 className="text-base font-semibold text-neutral-900">Sifariş tapılmadı</h2>
        <p className="text-xs text-neutral-500">Axtardığınız sifariş mövcud deyil və ya bu hesaba aid deyil.</p>
        <Link href="/orders" className="text-xs font-semibold text-neutral-900 hover:underline inline-block pt-2">
          Sifarişlərə qayıt
        </Link>
      </div>
    )
  }

  return <OrderDetailClient order={order} />
}
