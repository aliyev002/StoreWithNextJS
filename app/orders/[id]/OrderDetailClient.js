'use client'
import Link from 'next/link'
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, Truck, PackageCheck,
  User, MapPin, Phone, Printer, CreditCard, Banknote
} from 'lucide-react'

const statusMap = {
  pending: { label: 'Gözləmədə', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Təsdiqləndi', icon: CheckCircle2, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped: { label: 'Yoldadır', icon: Truck, className: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered: { label: 'Təhvil verildi', icon: PackageCheck, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Ləğv edildi', icon: XCircle, className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
}

export default function OrderDetailClient({ order }) {
  const currentStatus = statusMap[order.status] || statusMap.pending
  const StatusIcon = currentStatus.icon

  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity,
    0
  )
  const delivery = subtotal >= 50 || subtotal === 0 ? 0 : 5
  const finalTotal = order.total > 0 ? order.total : (subtotal - (order.discount || 0) + delivery)

  function handlePrintInvoice() {
    window.print()
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto print:max-w-full print:p-0">
      {/* Top back & print bar (hidden during print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Sifarişlərə qayıt
        </Link>

        <button
          onClick={handlePrintInvoice}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>PDF / İnvoysu Çap Et</span>
        </button>
      </div>

      {/* Invoice Card */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm print:border-none print:shadow-none print:p-2">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                Sifariş #{order.id}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentStatus.className} print:border-neutral-300`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{currentStatus.label}</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Tarix: {new Date(order.createdAt).toLocaleDateString('az-AZ', {
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
            <span className="text-2xl font-bold text-neutral-900">{finalTotal.toFixed(2)} AZN</span>
          </div>
        </div>

        {/* Shipping & Payment details */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Çatdırılma və Ödəniş Təfərrüatları
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs">
            <div className="space-y-1">
              <span className="text-neutral-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Ad Soyad
              </span>
              <p className="font-semibold text-neutral-800">{order.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Əlaqə
              </span>
              <p className="font-semibold text-neutral-800">{order.phone}</p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 flex items-center gap-1">
                {order.paymentMethod === 'card' ? <CreditCard className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                Ödəniş üsulu
              </span>
              <p className="font-semibold text-neutral-800 capitalize">
                {order.paymentMethod === 'card' ? 'Bank Kartı' : 'Qapıda Nağd'}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Ünvan
              </span>
              <p className="font-semibold text-neutral-800">{order.address}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Sifariş Edilən Məhsullar ({order.items.length})
          </h3>

          <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden">
            {order.items.map(item => {
              const itemPrice = item.price || item.product?.price || 0
              return (
                <div key={item.id} className="p-4 flex items-center gap-4 bg-white">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden shrink-0 print:hidden">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-900 truncate">
                      {item.product?.name}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {item.quantity} ədəd × {itemPrice.toFixed(2)} AZN
                      {item.variant ? ` • Çeşid: ${item.variant}` : ''}
                    </p>
                  </div>
                  <div className="text-right font-bold text-sm text-neutral-900">
                    {(itemPrice * item.quantity).toFixed(2)} AZN
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="border-t border-neutral-100 pt-4 space-y-2 text-xs sm:text-sm text-neutral-600 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Məhsul məbləği:</span>
            <span className="font-medium text-neutral-900">{subtotal.toFixed(2)} AZN</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Kupon endirimi:</span>
              <span>-{order.discount.toFixed(2)} AZN</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Çatdırılma:</span>
            <span className="font-medium text-neutral-900">
              {delivery === 0 ? 'Pulsuz' : `${delivery.toFixed(2)} AZN`}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-100">
            <span>Yekun Ödəniş:</span>
            <span>{finalTotal.toFixed(2)} AZN</span>
          </div>
        </div>
      </div>
    </div>
  )
}
