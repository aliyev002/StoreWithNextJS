'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { showToast } from '@/app/components/Toast'
import { Package, Clock, CheckCircle2, XCircle, Truck, PackageCheck, ChevronRight, X, ArrowRight, Printer, LogIn } from 'lucide-react'

const statusMap = {
  pending: { label: 'Gözləmədə', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Təsdiqləndi', icon: CheckCircle2, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped: { label: 'Yoldadır', icon: Truck, className: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered: { label: 'Təhvil verildi', icon: PackageCheck, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Ləğv edildi', icon: XCircle, className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  useEffect(() => {
    fetch('/api/orders-list')
      .then(res => {
        if (res.status === 401) {
          setIsUnauthorized(true)
          setLoading(false)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) {
          setOrders(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))
  }, [])

  async function cancelOrder(id) {
    if (!confirm('Bu sifarişi ləğv etmək istədiyinizə əminsiniz?')) return

    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setOrders(orders.filter(order => order.id !== id))
      showToast('Sifariş ləğv edildi', 'error')
    } else {
      showToast('Sifariş ləğv edilərkən xəta baş verdi', 'error')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-neutral-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Sifarişlərim
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Bütün cari və keçmiş sifarişlərinizin statusu və siyahısı
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200/90 rounded-2xl p-6 animate-pulse space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-neutral-200 rounded w-28" />
                <div className="h-6 bg-neutral-100 rounded-full w-24" />
              </div>
              <div className="h-3 bg-neutral-100 rounded w-48" />
              <div className="h-4 bg-neutral-200 rounded w-24 pt-2" />
            </div>
          ))}
        </div>
      ) : isUnauthorized ? (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-12 sm:p-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-lg">Giriş tələb olunur</h3>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Sifariş tarixçənizi və sifarişlərinizin çatdırılma statusunu görmək üçün hesabınıza daxil olun.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition"
            >
              <LogIn className="w-4 h-4" />
              Daxil ol
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-100 text-neutral-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition"
            >
              Qeydiyyat
            </Link>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-lg">Heç bir sifarişiniz yoxdur</h3>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Hələ ki heç bir sifariş verməmisiniz. Məhsul kataloqumuza nəzər yetirin.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition"
            >
              Alış-verişə başla
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const currentStatus = statusMap[order.status] || statusMap.pending
            const StatusIcon = currentStatus.icon
            const orderTotal = order.total > 0 ? order.total : order.items.reduce(
              (sum, item) => sum + (item.product?.price || 0) * item.quantity,
              0
            )

            return (
              <div
                key={order.id}
                className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-300 transition"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm sm:text-base text-neutral-900">
                          Sifariş #{order.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStatus.className}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{currentStatus.label}</span>
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString('az-AZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-neutral-400 block">Yekun məbləğ</span>
                      <span className="text-base sm:text-lg font-bold text-neutral-900">
                        {orderTotal.toFixed(2)} AZN
                      </span>
                    </div>
                  </div>

                  {/* Customer and address snippet */}
                  <div className="text-xs text-neutral-600 flex flex-wrap gap-x-6 gap-y-1">
                    <span>
                      <strong className="text-neutral-700">Qəbul edən:</strong> {order.name}
                    </span>
                    <span>
                      <strong className="text-neutral-700">Ünvan:</strong> {order.address}
                    </span>
                    <span>
                      <strong className="text-neutral-700">Ödəniş:</strong> {order.paymentMethod === 'card' ? 'Bank Kartı' : 'Qapıda Nağd'}
                    </span>
                  </div>

                  {/* Items mini-list */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {order.items.map(item => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg text-xs text-neutral-700"
                      >
                        <span className="font-medium">{item.product?.name || 'Məhsul'}</span>
                        {item.variant && (
                          <span className="text-[10px] bg-neutral-200/60 px-1.5 py-0.2 rounded text-neutral-600 font-semibold">
                            {item.variant}
                          </span>
                        )}
                        <span className="text-neutral-400">×{item.quantity}</span>
                      </span>
                    ))}
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition"
                    >
                      <span>Sifariş təfərrüatları & Faktura</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition"
                      >
                        Sifarişi ləğv et
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
