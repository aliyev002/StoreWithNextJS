'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { showToast } from '@/app/components/Toast'
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const [cart, setCart] = useState([])
  const router = useRouter()

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(items)
  }, [])

  function saveCart(newCart) {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  function increment(index) {
    const updated = [...cart]
    updated[index].quantity = (updated[index].quantity || 1) + 1
    saveCart(updated)
  }

  function decrement(index) {
    const updated = [...cart]
    const currentQty = updated[index].quantity || 1
    if (currentQty <= 1) {
      updated.splice(index, 1)
    } else {
      updated[index].quantity = currentQty - 1
    }
    saveCart(updated)
  }

  function removeItem(index) {
    const updated = [...cart]
    updated.splice(index, 1)
    saveCart(updated)
    showToast('Məhsul səbətdən silindi', 'error')
  }

  function clearCart() {
    saveCart([])
    showToast('Səbət tamamilə təmizləndi', 'error')
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const delivery = subtotal >= 50 || subtotal === 0 ? 0 : 5
  const total = subtotal + delivery

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Alış-veriş Səbəti
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {cart.length > 0 ? `${cart.length} bənd məhsul əlavə edilib` : 'Səbətiniz boşdur'}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs sm:text-sm font-medium text-neutral-500 hover:text-red-600 flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Səbəti təmizlə</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-12 sm:p-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-lg">Səbətiniz hazırda boşdur</h3>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Sevdiyiniz məhsulları kataloqdan seçib səbətə əlavə edərək sifarişinizi tamamlaya bilərsiniz.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition"
            >
              Məhsullara bax
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.variant || 'novar'}-${index}`}
                className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition hover:border-neutral-300"
              >
                <div className="w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="capitalize">{item.category}</span>
                    {item.variant && (
                      <>
                        <span>•</span>
                        <span className="bg-neutral-100 px-2 py-0.5 rounded font-medium text-neutral-700">
                          {item.variant}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm font-bold text-neutral-900 sm:hidden">
                    {(item.price * (item.quantity || 1)).toFixed(2)} AZN
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                    <button
                      onClick={() => decrement(index)}
                      className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-200/60 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-semibold text-xs sm:text-sm text-neutral-900">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => increment(index)}
                      className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-200/60 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-neutral-400 hover:text-red-600 rounded-lg transition"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden sm:block text-right shrink-0 min-w-24">
                  <span className="text-base font-bold text-neutral-900">
                    {(item.price * (item.quantity || 1)).toFixed(2)} AZN
                  </span>
                  <span className="block text-[11px] text-neutral-400">
                    {item.price.toFixed(2)} AZN / ədəd
                  </span>
                </div>
              </div>
            ))}

            <div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Alış-verişə davam et
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-5 sticky top-24">
            <h3 className="font-bold text-base sm:text-lg text-neutral-900">
              Sifariş Xülasəsi
            </h3>

            <div className="space-y-3 text-sm text-neutral-600 border-b border-neutral-100 pb-4">
              <div className="flex justify-between">
                <span>Məhsul məbləği</span>
                <span className="font-medium text-neutral-900">{subtotal.toFixed(2)} AZN</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Çatdırılma</span>
                <span className="font-medium text-neutral-900">
                  {delivery === 0 ? (
                    <span className="text-emerald-600 font-semibold">Pulsuz</span>
                  ) : (
                    `${delivery.toFixed(2)} AZN`
                  )}
                </span>
              </div>
              {subtotal < 50 && (
                <p className="text-[11px] text-neutral-400">
                  50 AZN üzəri sifarişlərdə çatdırılma pulsuzdur.
                </p>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-semibold text-neutral-900">Yekun məbləğ</span>
              <span className="text-2xl font-bold text-neutral-900">
                {total.toFixed(2)} AZN
              </span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Sifarişi rəsmiləşdir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
