import { getUserFromCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Package, ArrowLeft, Shield } from 'lucide-react'

export const metadata = {
  title: 'Admin Paneli — Mağaza',
}

export default async function AdminLayout({ children }) {
  const user = await getUserFromCookie()
  if (!user || user.role !== 'admin') {
    redirect('/signin')
  }

  return (
    <div className="space-y-6">
      {/* Admin Top Navigation */}
      <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-base">İdarəetmə Paneli</h1>
            <p className="text-xs text-neutral-400">Admin: {user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Statistika
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Məhsullar
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <Package className="w-3.5 h-3.5" />
            Sifarişlər
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sayta bax
          </Link>
        </div>
      </div>

      <div>{children}</div>
    </div>
  )
}
