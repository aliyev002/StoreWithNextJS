'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const decoded = jwt.decode(token)
      setUser(decoded)
    } catch {
      setUser(null)
    }
  }, [])

  return (
    <nav className="bg-gray-100 p-4 flex gap-4 border-b">
      <Link href="/products" className="font-bold">Məhsullar</Link>
      <Link href="/cart">Səbət</Link>
      <Link href="/checkout">Checkout</Link>

      {user ? (
        <>
          <Link href="/orders">Sifarişlərim</Link>
          <form action="/api/signout" method="POST">
            <button type="submit" className="text-red-600">Çıxış et</button>
          </form>
        </>
      ) : (
        <>
          <Link href="/signin">Daxil ol</Link>
          <Link href="/signup">Qeydiyyatdan keç</Link>
        </>
      )}
    </nav>
  )
}
