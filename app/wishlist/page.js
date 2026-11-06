'use client'
import useSWR from 'swr'
import Link from 'next/link'
import { addToCart } from '@/utils/cart'
import { showToast } from '@/app/components/Toast'
import { Heart, ShoppingBag, ArrowRight, Trash2, LogIn } from 'lucide-react'

const fetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('HTTP error')
    error.status = res.status
    try {
      error.info = await res.json()
    } catch {}
    throw error
  }
  return res.json()
}

export default function WishlistPage() {
  const { data: rawWishlist, error, isLoading, mutate } = useSWR('/api/wishlist', fetcher)

  const isUnauthorized = error && error.status === 401
  const wishlist = Array.isArray(rawWishlist) ? rawWishlist : []

  async function handleRemove(productId) {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      if (res.ok) {
        showToast('İstək siyahısından çıxarıldı', 'info')
        mutate()
      }
    } catch {
      showToast('Xəta baş verdi', 'error')
    }
  }

  function handleAddToCart(product) {
    if (product.stock <= 0) {
      showToast('Məhsul tükənib', 'error')
      return
    }
    addToCart(product)
    showToast(`"${product.name}" səbətə əlavə edildi`, 'success')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Bəyəndiklərim
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Daha sonra almaq üçün yadda saxladığınız sevimli məhsullar
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : isUnauthorized ? (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-12 sm:p-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-lg">Giriş tələb olunur</h3>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Bəyəndiyiniz məhsulları görmək və istək siyahınızı idarə etmək üçün zəhmət olmasa hesabınıza daxil olun.
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
      ) : wishlist.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-12 sm:p-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-lg">İstək siyahınız boşdur</h3>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Kataloqdan bəyəndiyiniz məhsulların üzərindəki ürək ikonuna klikləyərək bura əlavə edə bilərsiniz.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map(product => (
            <div
              key={product.id}
              className="group bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <Link href={`/products/${product.id}`} className="block relative aspect-square bg-neutral-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemove(product.id)
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-neutral-400 hover:text-red-600 transition shadow-sm"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>

                <div className="p-4 space-y-1">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400 block">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-neutral-900 text-sm hover:text-neutral-700 transition line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="text-sm font-bold text-neutral-900 block pt-1">
                    {product.price.toFixed(2)} AZN
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.stock <= 0 ? 'Tükənib' : 'Səbətə at'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
