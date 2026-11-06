'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { addToCart } from '@/utils/cart'
import { showToast } from '@/app/components/Toast'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RotateCcw,
  Check, Heart, MessageCircle, Star, Send
} from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function ProductDetailClient({ product }) {
  // Parse images & variants
  let galleryImages = [product.imageUrl]
  if (product.images) {
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed
      }
    } catch {}
  }

  let productVariants = []
  if (product.variants) {
    try {
      const parsed = typeof product.variants === 'string' ? JSON.parse(product.variants) : product.variants
      if (Array.isArray(parsed)) {
        productVariants = parsed
      }
    } catch {}
  }

  const [activeImage, setActiveImage] = useState(galleryImages[0] || product.imageUrl)
  const [selectedVariant, setSelectedVariant] = useState(productVariants[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Reviews state
  const { data: reviews = [], mutate: mutateReviews } = useSWR(`/api/reviews?productId=${product.id}`, fetcher)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const isOutOfStock = product.stock <= 0

  function handleAddToCart() {
    if (isOutOfStock) {
      showToast('Məhsul tükənib', 'error')
      return
    }
    addToCart(product, selectedVariant, quantity)
    setAdded(true)
    showToast(`"${product.name}" (${quantity} ədəd) səbətə əlavə edildi`, 'success')
    setTimeout(() => setAdded(false), 2500)
  }

  async function handleWishlistToggle() {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      })
      if (res.status === 401) {
        showToast('Bəyəndiklərinizə əlavə etmək üçün daxil olun', 'error')
        return
      }
      const data = await res.json()
      setIsWishlisted(data.added)
      showToast(data.message, data.added ? 'success' : 'info')
    } catch {
      showToast('Xəta baş verdi', 'error')
    }
  }

  function handleWhatsAppOrder() {
    const siteUrl = typeof window !== 'undefined' ? window.location.href : ''
    const variantText = selectedVariant ? ` Variant: ${selectedVariant},` : ''
    const msg = `Salam! Mən "${product.name}" məhsulunu sifariş etmək istəyirəm.${variantText} Qiymət: ${product.price} AZN. Keçid: ${siteUrl}`
    const waUrl = `https://wa.me/994553339220?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
  }

  async function handleReviewSubmit(e) {
    e.preventDefault()
    if (!reviewComment.trim()) return

    setSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment
        })
      })

      setSubmittingReview(false)
      if (res.status === 401) {
        showToast('Rəy bildirmək üçün öncə daxil olun', 'error')
        return
      }

      if (res.ok) {
        setReviewComment('')
        showToast('Rəyiniz uğurla paylaşıldı!', 'success')
        mutateReviews()
      } else {
        const d = await res.json()
        showToast(d.error || 'Xəta baş verdi', 'error')
      }
    } catch {
      setSubmittingReview(false)
      showToast('Xəta baş verdi', 'error')
    }
  }

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 hover:text-neutral-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Məhsullara qayıt
        </Link>
      </div>

      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-100">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/95 backdrop-blur rounded-full text-neutral-800 shadow-sm">
                {product.category}
              </span>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      activeImage === img ? 'border-neutral-900 shadow-sm' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {avgRating && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{avgRating} ({reviews.length} rəy)</span>
                    </div>
                  )}
                  {/* Stock status */}
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    isOutOfStock
                      ? 'bg-red-50 text-red-700'
                      : product.stock <= 5
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {isOutOfStock ? 'Bitib' : `Stokda: ${product.stock} ədəd`}
                  </span>
                </div>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-full border transition ${
                    isWishlisted ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-neutral-200 text-neutral-400 hover:text-rose-600'
                  }`}
                  title="Bəyəndiklərim"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                {product.name}
              </h1>
              <div className="text-2xl font-bold text-neutral-900">
                {product.price.toFixed(2)} AZN
              </div>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.desc}
            </p>

            {/* Variants (Size / Color) */}
            {productVariants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block">
                  Çeşid / Ölçü seçimi
                </span>
                <div className="flex flex-wrap gap-2">
                  {productVariants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        selectedVariant === v
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Buy buttons */}
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2.5 text-neutral-600 hover:bg-neutral-200/60 disabled:opacity-40 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-sm text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2.5 text-neutral-600 hover:bg-neutral-200/60 disabled:opacity-40 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={added || isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition shadow-sm ${
                    isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  {isOutOfStock ? (
                    <span>Hazırda mövcud deyil</span>
                  ) : added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Səbətə əlavə olundu</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Səbətə əlavə et</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp direct order button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 border border-emerald-500/80 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp ilə Sürətli Sifariş</span>
              </button>
            </div>

            {/* Perks */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>24 saat ərzində sürətli çatdırılma</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Rəsmi keyfiyyət və zəmanət</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <RotateCcw className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>14 gün ərzində asan dəyişdirmə hüququ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Müştəri Rəyləri
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Bu məhsul barədə rəylər və qiymətləndirmələr
            </p>
          </div>

          {avgRating && (
            <div className="flex items-center gap-1.5 text-base font-bold text-neutral-900">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{avgRating} / 5.0</span>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Qiymət verin:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              placeholder="Məhsul haqqında təcrübənizi bölüşün..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submittingReview ? 'Paylaşılır...' : 'Rəyi Paylaş'}</span>
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-xs sm:text-sm text-neutral-400 py-6">
              Hələ ki heç bir rəy yazılmayıb. İlk rəyi siz yazın!
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-neutral-100 pb-4 space-y-1.5 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-neutral-800">
                    {r.user?.email || 'İstifadəçi'}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {r.comment}
                </p>
                <span className="text-[10px] text-neutral-400 block">
                  {new Date(r.createdAt).toLocaleDateString('az-AZ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
