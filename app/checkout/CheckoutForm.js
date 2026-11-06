'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { showToast } from '@/app/components/Toast'
import { User, MapPin, Phone, ArrowRight, ShieldCheck, ShoppingBag, Loader2, Tag, CreditCard, Banknote, Check } from 'lucide-react'

export default function CheckoutForm() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash') // cash | card
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null) // { code, discount }
  const [loading, setLoading] = useState(false)
  const [checkingCoupon, setCheckingCoupon] = useState(false)

  // Fake card fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(items)
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const delivery = subtotal >= 50 || subtotal === 0 ? 0 : 5
  const total = Math.max(0, subtotal - discount) + delivery

  async function handleApplyCoupon(e) {
    e.preventDefault()
    if (!couponInput.trim()) return

    setCheckingCoupon(true)
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal })
      })

      const data = await res.json()
      setCheckingCoupon(false)

      if (res.ok && data.valid) {
        setAppliedCoupon({ code: data.code, discount: data.discount })
        showToast(data.message, 'success')
      } else {
        showToast(data.error || 'Kupon etibarsızdır', 'error')
      }
    } catch {
      setCheckingCoupon(false)
      showToast('Kupon yoxlanılarkən xəta baş verdi', 'error')
    }
  }

  async function handleCheckout(e) {
    e.preventDefault()

    if (!name.trim() || !address.trim() || !phone.trim()) {
      showToast('Zəhmət olmasa bütün çatdırılma xanalarını doldurun', 'error')
      return
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
        showToast('Kart məlumatlarını tam daxil edin', 'error')
        return
      }
    }

    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          address,
          phone,
          cart,
          paymentMethod,
          couponCode: appliedCoupon ? appliedCoupon.code : ''
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (res.status === 401) {
        showToast('Sifariş üçün öncə sistemə daxil olun', 'error')
        router.push('/signin')
        return
      }

      if (res.ok) {
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('cart-updated'))
        showToast('Sifarişiniz uğurla tamamlandı!', 'success')
        router.push('/orders')
      } else {
        showToast(data.error || 'Sifariş qeydə alınarkən xəta baş verdi', 'error')
      }
    } catch (err) {
      setLoading(false)
      showToast('Şəbəkə xətası baş verdi', 'error')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="font-semibold text-neutral-900 text-lg">Səbətiniz boşdur</h3>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Sifariş vermək üçün səbətinizə ən azı bir məhsul əlavə etməlisiniz.
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
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shipping details */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
              1. Çatdırılma Məlumatları
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Məhsulun çatdırılacağı şəxsi və ünvan məlumatlarını qeyd edin
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Ad və Soyad
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Məs: Əli Əliyev"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Çatdırılma Ünvanı
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <textarea
                  required
                  rows={2}
                  placeholder="Şəhər, rayon, küçə, bina, mənzil..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Əlaqə Nömrəsi
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+994 (55) 333-92-20"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
              2. Ödəniş Üsulu
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Sizin üçün ən rahat ödəniş variantını seçin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition ${
                paymentMethod === 'cash'
                  ? 'border-neutral-900 bg-neutral-50 shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Banknote className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-neutral-900">Qapıda Nağd Ödəniş</p>
                <p className="text-xs text-neutral-500 mt-0.5">Sifarişi təhvil alarkən nağd ödəyin</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition ${
                paymentMethod === 'card'
                  ? 'border-neutral-900 bg-neutral-50 shadow-sm'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <CreditCard className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-neutral-900">Onlayn Bank Kartı</p>
                <p className="text-xs text-neutral-500 mt-0.5">Visa / Mastercard ilə təhlükəsiz</p>
              </div>
            </button>
          </div>

          {/* Card fields if card selected */}
          {paymentMethod === 'card' && (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-3 animate-in fade-in">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Kart nömrəsi</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">Bitmə tarixi</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sifariş tamamlanır...</span>
                </>
              ) : (
                <>
                  <span>Sifarişi Təsdiqlə ({total.toFixed(2)} AZN)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>Məlumatlarınız şifrələnir və tam təhlükəsiz saxlanılır.</span>
          </div>
        </div>
      </div>

      {/* Order Summary & Coupon */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-5 sticky top-24">
        <h3 className="font-bold text-base text-neutral-900">
          Sifariş Xülasəsi ({cart.length})
        </h3>

        {/* Promo code form */}
        <form onSubmit={handleApplyCoupon} className="space-y-2 border-b border-neutral-100 pb-4">
          <label className="block text-xs font-semibold text-neutral-600">Promokod / Kupon</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Məs: BAHAR20"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl pl-8 pr-3 py-2 text-xs uppercase font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={checkingCoupon || !couponInput.trim()}
              className="px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50 transition"
            >
              {checkingCoupon ? '...' : 'Tətbiq et'}
            </button>
          </div>
          {appliedCoupon && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{appliedCoupon.code} aktivdir (-{appliedCoupon.discount} AZN)</span>
            </p>
          )}
        </form>

        {/* Items snippet */}
        <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto pr-1">
          {cart.map((item, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-800 truncate">{item.name}</p>
                  <p className="text-neutral-400">
                    {item.quantity || 1} ədəd {item.variant ? `(${item.variant})` : ''}
                  </p>
                </div>
              </div>
              <span className="font-bold text-neutral-900 shrink-0">
                {(item.price * (item.quantity || 1)).toFixed(2)} AZN
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 text-xs sm:text-sm text-neutral-600 border-t border-neutral-100 pt-3">
          <div className="flex justify-between">
            <span>Məhsul məbləği</span>
            <span className="font-medium text-neutral-900">{subtotal.toFixed(2)} AZN</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Kupon endirimi</span>
              <span>-{discount.toFixed(2)} AZN</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span>Çatdırılma</span>
            <span className="font-medium text-neutral-900">
              {delivery === 0 ? <span className="text-emerald-600 font-semibold">Pulsuz</span> : `${delivery.toFixed(2)} AZN`}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-baseline pt-3 border-t border-neutral-100">
          <span className="font-semibold text-neutral-900 text-sm">Yekun</span>
          <span className="text-xl font-bold text-neutral-900">
            {total.toFixed(2)} AZN
          </span>
        </div>
      </div>
    </div>
  )
}
