import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, ArrowUpRight } from 'lucide-react'

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { id: 'desc' },
  })

  const categories = [
    { key: 'shoes', label: 'Ayaqqabılar', count: 'Mövsüm kolleksiyası', href: '/products?category=shoes' },
    { key: 'clothing', label: 'Geyim', count: 'Kişi və Qadın', href: '/products?category=clothing' },
    { key: 'electronics', label: 'Elektronika', count: 'Yeni qadcetlər', href: '/products?category=electronics' },
  ]

  const highlights = [
    {
      icon: Truck,
      title: 'Sürətli Çatdırılma',
      desc: 'Bütün şəhərdaxili ünvanlara 24 saat ərzində təhvil verilir.',
    },
    {
      icon: ShieldCheck,
      title: 'Orijinal Zəmanət',
      desc: 'Bütün məhsullarımız rəsmi zəmanət və keyfiyyət sertifikatlıdır.',
    },
    {
      icon: RotateCcw,
      title: 'Asan Geri Qaytarma',
      desc: '14 gün ərzində heç bir sual soruşulmadan rahat qaytarma imkanı.',
    },
  ]

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white p-8 sm:p-14 lg:p-20 shadow-xl shadow-neutral-900/10">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wide text-neutral-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Yeni Sezon Kolleksiyası 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Hər gün üçün <br />
            <span className="text-neutral-400 font-light">premium seçim.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 font-normal max-w-lg leading-relaxed">
            Dəb, texnologiya və rahatlıq bir arada. Geniş çeşidli məhsullarımızı kəşf edin və ən sərfəli şərtlərlə sifariş edin.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-neutral-900 hover:bg-neutral-100 font-medium text-sm rounded-xl transition shadow-sm"
            >
              Məhsulları kəşf et
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products?category=electronics"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-800/80 hover:bg-neutral-800 text-white border border-neutral-700/80 font-medium text-sm rounded-xl transition"
            >
              Elektronika
            </Link>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-neutral-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Kateqoriyalar</h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">İstədiyiniz kateqoriya üzrə axtarışa başlayın</p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 group"
          >
            Hamısına bax
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group p-6 bg-white border border-neutral-200/90 rounded-2xl hover:border-neutral-900 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-neutral-900 group-hover:text-neutral-950">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">{cat.count}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Seçilmiş Məhsullar</h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">Ən çox bəyənilən və sifariş edilən modellər</p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1 group"
          >
            Bütün kolleksiya
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map(product => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase bg-white/90 backdrop-blur rounded-full text-neutral-800">
                  {product.category}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm group-hover:text-neutral-600 transition truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                    {product.desc}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-base font-bold text-neutral-900">
                    {product.price.toFixed(2)} AZN
                  </span>
                  <span className="text-xs font-medium text-neutral-600 group-hover:text-neutral-900 transition flex items-center gap-1">
                    Bax
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <h4 className="font-semibold text-neutral-900 text-base">{item.title}</h4>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
