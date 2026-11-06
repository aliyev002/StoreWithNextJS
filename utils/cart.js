export function getCart() {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('cart') || '[]')
}

export function addToCart(product, variant = null, quantity = 1) {
  const cart = getCart()
  const existing = cart.find(p => p.id === product.id && (p.variant || null) === (variant || null))

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      variant: variant || null,
      quantity: quantity
    })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}
