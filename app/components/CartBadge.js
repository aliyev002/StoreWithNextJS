'use client'
import { useEffect, useState } from 'react'

export default function CartBadge() {
  const [count, setCount] = useState(0)

  function updateCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
    setCount(total)
  }

  useEffect(() => {
    updateCount()
    window.addEventListener('cart-updated', updateCount)
    window.addEventListener('storage', updateCount)
    return () => {
      window.removeEventListener('cart-updated', updateCount)
      window.removeEventListener('storage', updateCount)
    }
  }, [])

  if (count === 0) return null

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold tracking-tight bg-neutral-900 text-white rounded-full ml-1">
      {count > 99 ? '99+' : count}
    </span>
  )
}
