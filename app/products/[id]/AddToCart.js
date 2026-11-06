'use client'

export default function AddToCart({ product }) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.id)

    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Səbətə əlavə olundu!')
  }

  return (
    <button
      onClick={addToCart}
      className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
    >
      Səbətə əlavə et
    </button>
  )
}
