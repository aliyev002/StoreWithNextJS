'use client'
import useSWR from 'swr'
import { showToast } from '@/app/components/Toast'
import { Package, Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading, mutate } = useSWR('/api/admin/orders', fetcher)

  async function handleStatusChange(orderId, newStatus) {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      })

      if (res.ok) {
        showToast(`Sifariş #${orderId} statusu yeniləndi: ${newStatus}`, 'success')
        mutate()
      } else {
        showToast('Status yenilənmədi', 'error')
      }
    } catch {
      showToast('Xəta baş verdi', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200/80 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Sifarişlərin İdarə Edilməsi
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Bütün sifarişləri izləyin və statuslarını dərhal dəyişin
        </p>
      </div>

      <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 border-b border-neutral-200/80 text-[11px] font-semibold uppercase text-neutral-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Sifariş #</th>
                <th className="py-3.5 px-4">Müştəri & Əlaqə</th>
                <th className="py-3.5 px-4">Ünvan</th>
                <th className="py-3.5 px-4">Məhsullar</th>
                <th className="py-3.5 px-4">Ödəniş & Məbləğ</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400">Yüklənir...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400">Heç bir sifariş yoxdur.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/50 transition">
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      #{o.id}
                      <span className="block text-[10px] text-neutral-400 font-normal">
                        {new Date(o.createdAt).toLocaleDateString('az-AZ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-800">{o.name}</p>
                      <p className="text-[11px] text-neutral-500">{o.phone}</p>
                      <p className="text-[10px] text-neutral-400">{o.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-neutral-700" title={o.address}>
                      {o.address}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {o.items?.map((it, idx) => (
                          <p key={idx} className="text-[11px] truncate max-w-xs">
                            <span className="font-medium text-neutral-800">{it.product?.name}</span>{' '}
                            <span className="text-neutral-400">×{it.quantity} {it.variant ? `(${it.variant})` : ''}</span>
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-neutral-900 block text-sm">{o.total?.toFixed(2)} AZN</span>
                      <span className="text-[10px] uppercase text-neutral-400 font-medium">
                        {o.paymentMethod === 'card' ? 'Kartla' : 'Nağd'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none transition ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : o.status === 'shipped'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : o.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : o.status === 'cancelled'
                            ? 'bg-neutral-100 text-neutral-500 border-neutral-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">Gözləmədə (pending)</option>
                        <option value="confirmed">Təsdiqləndi (confirmed)</option>
                        <option value="shipped">Yoldadır (shipped)</option>
                        <option value="delivered">Təhvil verildi (delivered)</option>
                        <option value="cancelled">Ləğv edildi (cancelled)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
