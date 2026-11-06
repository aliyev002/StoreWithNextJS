'use client'
import useSWR from 'swr'
import Link from 'next/link'
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, ArrowRight, Clock } from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function AdminDashboardPage() {
  const { data: stats, error, isLoading } = useSWR('/api/admin/stats', fetcher)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 h-28 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || !stats) {
    return <div className="text-red-600 text-sm">Statistika yüklənərkən xəta baş verdi.</div>
  }

  const statCards = [
    { title: 'Ümumi Gəlir', value: `${stats.revenue} AZN`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Sifariş Sayı', value: stats.totalOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Məhsul Çeşidi', value: stats.totalProducts, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Müştəri Sayı', value: stats.totalUsers, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-8">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="font-bold text-base text-neutral-900">Son Sifarişlər</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
              Hamısına bax <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {stats.recentOrders?.map(order => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">#{order.id}</span>
                    <span className="text-neutral-500">{order.name}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px]">{new Date(order.createdAt).toLocaleDateString('az-AZ')}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-900 block">{order.total?.toFixed(2)} AZN</span>
                  <span className="text-[10px] text-neutral-500 capitalize">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 border-b border-neutral-100 pb-4">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="font-bold text-base text-neutral-900">Tükənmək Üzrə</h2>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {stats.lowStockProducts?.length === 0 ? (
              <p className="text-neutral-400 py-4">Bütün məhsulların stoku yetərlidir.</p>
            ) : (
              stats.lowStockProducts?.map(p => (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                  <span className="font-medium text-neutral-800 truncate">{p.name}</span>
                  <span className="font-bold text-red-600 shrink-0 bg-red-50 px-2 py-0.5 rounded">
                    Qalıq: {p.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
