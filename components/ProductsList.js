'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function ProductsList() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const { data: products = [], error } = useSWR(`/api/products${category ? '?category=' + category : ''}`, fetcher)

  if (error) return <div className="p-4 text-red-500">Xəta baş verdi.</div>
  if (!products) return <div className="p-4">Yüklənir...</div>

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Məhsullar</h1>

      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Link href="/products" className="px-4 py-1 border rounded-full hover:bg-blue-100 transition">Hamısı</Link>
        <Link href="/products?category=shoes" className="px-4 py-1 border rounded-full hover:bg-blue-100 transition">Ayaqqabılar</Link>
        <Link href="/products?category=clothing" className="px-4 py-1 border rounded-full hover:bg-blue-100 transition">Geyim</Link>
        <Link href="/products?category=electronics" className="px-4 py-1 border rounded-full hover:bg-blue-100 transition">Elektronika</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
            <div className="h-64 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-4 bg-gray-50"
              />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{product.desc}</p>
              </div>
              <div className="mt-3">
                <p className="text-blue-600 font-bold">{product.price} AZN</p>
                <Link
                  href={`/products/${product.id}`}
                  className="inline-block mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
                >
                  Ətraflı
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
