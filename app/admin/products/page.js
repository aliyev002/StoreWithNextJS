'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { showToast } from '@/app/components/Toast'
import { Plus, Trash2, Edit2, Check, X, Search, Package } from 'lucide-react'

const fetcher = (url) => fetch(url).then(res => res.json())

export default function AdminProductsPage() {
  const { data: products = [], isLoading, mutate } = useSWR('/api/admin/products', fetcher)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editPrice, setEditPrice] = useState('')
  const [editStock, setEditStock] = useState('')

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    desc: '',
    price: '',
    category: 'shoes',
    imageUrl: '',
    stock: 10,
    variants: '40, 41, 42, 43',
    images: ''
  })
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const variantsArr = newProduct.variants.split(',').map(v => v.trim()).filter(Boolean)
      const imagesArr = newProduct.images ? newProduct.images.split('\n').map(i => i.trim()).filter(Boolean) : [newProduct.imageUrl]

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          variants: JSON.stringify(variantsArr),
          images: JSON.stringify(imagesArr)
        })
      })

      setSubmitting(false)
      if (res.ok) {
        showToast('Məhsul uğurla əlavə edildi', 'success')
        setShowAddModal(false)
        setNewProduct({
          name: '',
          desc: '',
          price: '',
          category: 'shoes',
          imageUrl: '',
          stock: 10,
          variants: '40, 41, 42, 43',
          images: ''
        })
        mutate()
      } else {
        const d = await res.json()
        showToast(d.error || 'Xəta baş verdi', 'error')
      }
    } catch {
      setSubmitting(false)
      showToast('Xəta baş verdi', 'error')
    }
  }

  async function handleQuickUpdate(product) {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          desc: product.desc,
          category: product.category,
          imageUrl: product.imageUrl,
          price: editPrice ? parseFloat(editPrice) : product.price,
          stock: editStock !== '' ? parseInt(editStock) : product.stock
        })
      })

      if (res.ok) {
        showToast('Yeniləndi', 'success')
        setEditingId(null)
        mutate()
      }
    } catch {
      showToast('Xəta baş verdi', 'error')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Bu məhsulu silmək istədiyinizə əminsiniz?')) return
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Məhsul silindi', 'info')
        mutate()
      } else {
        showToast('Silinmə xətası', 'error')
      }
    } catch {
      showToast('Xəta baş verdi', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Məhsul İdarəetməsi
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Məhsul əlavə et, stok və qiymətləri anında yenilə
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Məhsul</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 border-b border-neutral-200/80 text-[11px] font-semibold uppercase text-neutral-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Şəkil</th>
                <th className="py-3.5 px-4">Ad</th>
                <th className="py-3.5 px-4">Kateqoriya</th>
                <th className="py-3.5 px-4">Qiymət (AZN)</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400">Yüklənir...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-neutral-400">Heç bir məhsul tapılmadı.</td>
                </tr>
              ) : (
                products.map((p) => {
                  const isEditing = editingId === p.id
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition">
                      <td className="py-2.5 px-4">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-100" />
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-neutral-900 max-w-xs truncate">{p.name}</td>
                      <td className="py-2.5 px-4 capitalize">{p.category}</td>
                      <td className="py-2.5 px-4 font-bold text-neutral-900">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            className="w-20 border rounded px-2 py-1 text-xs"
                          />
                        ) : (
                          `${p.price.toFixed(2)} AZN`
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={e => setEditStock(e.target.value)}
                            className="w-16 border rounded px-2 py-1 text-xs"
                          />
                        ) : (
                          <span className={`px-2 py-0.5 rounded font-medium ${p.stock <= 5 ? 'bg-red-50 text-red-600 font-bold' : 'bg-neutral-100 text-neutral-700'}`}>
                            {p.stock} ədəd
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleQuickUpdate(p)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Yadda saxla"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-neutral-400 hover:bg-neutral-100 rounded"
                              title="İmtina"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingId(p.id)
                                setEditPrice(p.price)
                                setEditStock(p.stock)
                              }}
                              className="p-1 text-neutral-500 hover:text-neutral-900"
                              title="Redaktə et"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-1 text-neutral-400 hover:text-red-600"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-lg text-neutral-900">Yeni Məhsul Əlavə Et</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Məhsulun Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Nike Air Max"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Təsviri</label>
                <textarea
                  rows={2}
                  placeholder="Məhsul haqqında qısa məlumat..."
                  value={newProduct.desc}
                  onChange={e => setNewProduct({ ...newProduct, desc: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Qiymət (AZN)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Stok Miqdarı</label>
                  <input
                    type="number"
                    required
                    placeholder="15"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Kateqoriya</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs bg-white"
                  >
                    <option value="shoes">Ayaqqabılar (shoes)</option>
                    <option value="clothing">Geyim (clothing)</option>
                    <option value="electronics">Elektronika (electronics)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Çeşidlər (Vergüllə ayırın)</label>
                  <input
                    type="text"
                    placeholder="S, M, L və ya 41, 42"
                    value={newProduct.variants}
                    onChange={e => setNewProduct({ ...newProduct, variants: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Əsas Şəkil URL-i</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.com/photo.png"
                  value={newProduct.imageUrl}
                  onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Əlavə Qalereya Şəkilləri (Hər sətirdə bir URL)</label>
                <textarea
                  rows={2}
                  placeholder="https://images.com/angle1.png&#10;https://images.com/angle2.png"
                  value={newProduct.images}
                  onChange={e => setNewProduct({ ...newProduct, images: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-neutral-600 hover:bg-neutral-50"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 disabled:opacity-60"
                >
                  {submitting ? 'Yaradılır...' : 'Əlavə et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
