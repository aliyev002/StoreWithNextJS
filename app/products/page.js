'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'
import { addToCart } from '@/utils/cart'
import { showToast } from '@/app/components/Toast'
import { Search, Plus, Check, SlidersHorizontal, Star, Heart, ArrowUpDown, X } from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

const categories = [
  { key: '', label: 'Hamısı' },
  { key: 'shoes', label: 'Ayaqqabılar' },
  { key: 'clothing', label: 'Geyim' },
  { key: 'electronics', label: 'Elektronika' },
]

function ProductCard({ product, onWishlistToggle, isWishlisted }) {
  const [added, setAdded] = useState(false)
  const isOutOfStock = product.stock <= 0

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) {
      showToast('Bu məhsul hazırda tükənib', 'error')
      return
    }
    addToCart(product)
    setAdded(true)
    showToast(`"${product.name}" səbətə əlavə edildi`, 'success')
    setTimeout(() => setAdded(false), 2000)
  }

  function handleHeart(e) {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle(product.id)
  }

  return (
    <div className="group bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square bg-neutral-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
          />

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-white/95 backdrop-blur rounded-full text-neutral-700 shadow-sm">
            {product.category}
          </span>

          {/* Stock badge */}
          {isOutOfStock ? (
            <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-900/90 text-white rounded-md">
              Tükənib
            </span>
          ) : product.stock <= 5 ? (
            <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-semibold tracking-wider bg-amber-500/90 text-white rounded-md">
              Son {product.stock} ədəd
            </span>
          ) : null}

          {/* Wishlist Heart */}
          <button
            onClick={handleHeart}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-sm ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/80 text-neutral-500 hover:text-rose-600 hover:bg-white'
            }`}
            title="Bəyəndiklərimə əlavə et"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4 space-y-1.5">
          {product.avgRating && (
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.avgRating}</span>
              <span className="text-neutral-400 font-normal">({product.reviewsCount})</span>
            </div>
          )}

          <h3 className="font-semibold text-neutral-900 text-sm group-hover:text-neutral-700 transition line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {product.desc}
          </p>
        </div>
      </Link>

      <div className="p-4 pt-0 flex items-center justify-between border-t border-neutral-100 mt-2">
        <div>
          <span className="text-xs text-neutral-400 block font-normal">Qiymət</span>
          <span className="text-base font-bold text-neutral-900">
            {product.price.toFixed(2)} AZN
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={added || isOutOfStock}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
            isOutOfStock
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm'
          }`}
        >
          {isOutOfStock ? (
            <span>Bitib</span>
          ) : added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Əlavə olundu</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Səbətə</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between">
      <div>
        <div className="aspect-square bg-neutral-100" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-3 bg-neutral-100 rounded w-full" />
          <div className="h-3 bg-neutral-100 rounded w-1/2" />
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between border-t border-neutral-100 mt-2">
        <div className="h-5 bg-neutral-200 rounded w-16" />
        <div className="h-8 bg-neutral-200 rounded-xl w-24" />
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const inStock = searchParams.get('inStock') === 'true'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [searchInput, setSearchInput] = useState(search)
  const [filterOpen, setFilterOpen] = useState(false)
  const [tempMin, setTempMin] = useState(minPrice)
  const [tempMax, setTempMax] = useState(maxPrice)
  const [wishlistIds, setWishlistIds] = useState(new Set())

  // Load wishlist
  useSWR('/api/wishlist', fetcher, {
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        setWishlistIds(new Set(data.map(p => p.id)))
      }
    }
  })

  // Build query
  const query = new URLSearchParams()
  if (category) query.set('category', category)
  if (search) query.set('search', search)
  if (sort) query.set('sort', sort)
  if (inStock) query.set('inStock', 'true')
  if (minPrice) query.set('minPrice', minPrice)
  if (maxPrice) query.set('maxPrice', maxPrice)

  const { data: rawProducts = [], error, isLoading } = useSWR(`/api/products?${query.toString()}`, fetcher)
  const products = Array.isArray(rawProducts) ? rawProducts : []

  function updateQuery(newParams) {
    const current = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === '' || v === null || v === false) {
        current.delete(k)
      } else {
        current.set(k, v)
      }
    })
    router.push('/products?' + current.toString())
  }

  function handleSearch(e) {
    e.preventDefault()
    updateQuery({ search: searchInput.trim() })
  }

  async function handleWishlistToggle(productId) {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (res.status === 401) {
        showToast('Bəyəndiklərinizə əlavə etmək üçün daxil olun', 'error')
        router.push('/signin')
        return
      }

      const data = await res.json()
      if (res.ok) {
        const next = new Set(wishlistIds)
        if (data.added) {
          next.add(productId)
          showToast(data.message, 'success')
        } else {
          next.delete(productId)
          showToast(data.message, 'info')
        }
        setWishlistIds(next)
      }
    } catch {
      showToast('Xəta baş verdi', 'error')
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Məhsul Kataloqu
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {!isLoading && `${products.length} məhsul mövcuddur`}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Məhsul axtar..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
            />
          </form>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition ${
              filterOpen || inStock || minPrice || maxPrice
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtrlər</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer / Bar */}
      {filterOpen && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-neutral-900">Təkmil Filtrləmə</h3>
            <button
              onClick={() => {
                setTempMin('')
                setTempMax('')
                updateQuery({ minPrice: '', maxPrice: '', inStock: false })
              }}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline"
            >
              Sıfırla
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Qiymət aralığı (AZN)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={tempMin}
                  onChange={e => setTempMin(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800"
                />
                <span className="text-neutral-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={tempMax}
                  onChange={e => setTempMax(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800"
                />
                <button
                  onClick={() => updateQuery({ minPrice: tempMin, maxPrice: tempMax })}
                  className="px-3 py-1.5 bg-neutral-900 text-white text-xs rounded-lg font-medium hover:bg-neutral-800"
                >
                  Tətbiq
                </button>
              </div>
            </div>

            {/* In stock only */}
            <div className="flex items-center sm:pt-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={e => updateQuery({ inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900"
                />
                <span>Yalnız stokda olanlar</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map(cat => {
            const isActive = category === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => updateQuery({ category: cat.key })}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={sort}
            onChange={e => updateQuery({ sort: e.target.value })}
            className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="newest">Ən yenilər</option>
            <option value="price_asc">Qiymət: Ucuzdan bahaya</option>
            <option value="price_desc">Qiymət: Bahadan ucuza</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-neutral-900 text-base">Məhsul tapılmadı</h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Axtarış meyarlarınıza uyğun məhsul tapılmadı. Zəhmət olmasa filtrləri dəyişin.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="text-xs font-semibold text-neutral-900 hover:underline pt-2 inline-block"
          >
            Bütün filtrləri təmizlə
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.has(product.id)}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
