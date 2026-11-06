import './globals.css'
import Link from 'next/link'
import { getUserFromCookie } from '@/lib/auth'
import ToastContainer from '@/app/components/Toast'
import CartBadge from '@/app/components/CartBadge'
import { Store, ShoppingBag, Package, User, LogOut, LogIn, UserPlus, Heart, Shield, Phone } from 'lucide-react'

// Clean SVG Instagram icon without external dependency
function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export const metadata = {
  title: 'Mağaza — Müasir Online Alış-veriş',
  description: 'Keyfiyyətli məhsullar, sürətli çatdırılma.',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }) {
  const user = await getUserFromCookie()

  return (
    <html lang="az">
      <body className="bg-neutral-50 text-neutral-900 min-h-screen flex flex-col antialiased selection:bg-neutral-900 selection:text-white">
        {/* Header / Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200/80 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-neutral-900 hover:opacity-85 transition shrink-0">
              <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white shadow-sm shadow-neutral-900/10">
                <Store className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-semibold text-base sm:text-lg">Mağaza</span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-600">
              <Link
                href="/products"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-neutral-900 hover:bg-neutral-100/80 transition"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                Məhsullar
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-neutral-900 hover:bg-neutral-100/80 transition"
              >
                <Heart className="w-4 h-4 stroke-[2]" />
                Bəyəndiklərim
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-neutral-900 hover:bg-neutral-100/80 transition relative"
              >
                <Package className="w-4 h-4 stroke-[2]" />
                Səbət
                <CartBadge />
              </Link>
              {user && (
                <>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-neutral-900 hover:bg-neutral-100/80 transition"
                  >
                    <Package className="w-4 h-4 stroke-[2]" />
                    Sifarişlər
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg hover:text-neutral-900 hover:bg-neutral-100/80 transition"
                  >
                    <User className="w-4 h-4 stroke-[2]" />
                    Profil
                  </Link>
                </>
              )}
              {user && user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition ml-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/wishlist"
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                title="Bəyəndiklərim"
              >
                <Heart className="w-5 h-5" />
              </Link>
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200/80 px-3 py-1.5 rounded-full transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {user.email}
                  </Link>
                  <form action="/api/signout" method="POST">
                    <button
                      type="submit"
                      title="Çıxış"
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50/80 px-3 py-2 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Çıxış</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signin"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 px-3 py-2 rounded-lg transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Daxil ol
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 px-3.5 py-2 rounded-lg transition shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Qeydiyyat
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-neutral-200 mt-auto text-neutral-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 font-bold text-neutral-900">
                  <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                    <Store className="w-4 h-4" />
                  </div>
                  <span>Mağaza</span>
                </div>
                <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
                  Keyfiyyətli məhsullar, sürətli və zəmanətli çatdırılma. Rahat alış-veriş təcrübəsi.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Keçidlər</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/products" className="hover:text-neutral-900 transition">Bütün məhsullar</Link></li>
                  <li><Link href="/wishlist" className="hover:text-neutral-900 transition">Bəyəndiklərim</Link></li>
                  <li><Link href="/cart" className="hover:text-neutral-900 transition">Səbət</Link></li>
                  <li><Link href="/orders" className="hover:text-neutral-900 transition">Sifarişlərim</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Hesab</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/signin" className="hover:text-neutral-900 transition">Daxil ol</Link></li>
                  <li><Link href="/signup" className="hover:text-neutral-900 transition">Hesab yarat</Link></li>
                  <li><Link href="/profile" className="hover:text-neutral-900 transition">Profil məlumatları</Link></li>
                  {user && user.role === 'admin' && (
                    <li><Link href="/admin" className="text-neutral-900 font-semibold hover:underline transition">Admin Paneli</Link></li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">Əlaqə</h4>
                <div className="space-y-2.5 text-sm">
                  <a
                    href="tel:+994553339220"
                    className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition"
                  >
                    <Phone className="w-4 h-4 text-neutral-500" />
                    <span>055 333 92 20</span>
                  </a>
                  <a
                    href="https://instagram.com/aliyevt_02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition"
                  >
                    <InstagramIcon className="w-4 h-4 text-neutral-500" />
                    <span>@aliyevt_02</span>
                  </a>
                  <p className="text-xs text-neutral-400 pt-1">
                    Həftənin hər günü 09:00 - 21:00 xidmətinizdəyik.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
              <p>© {new Date().getFullYear()} Mağaza. Bütün hüquqlar qorunur.</p>
              <div className="flex items-center gap-4">
                <span>Təhlükəsiz ödəniş</span>
                <span>•</span>
                <span>Sürətli çatdırılma</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Global Toast */}
        <ToastContainer />
      </body>
    </html>
  )
}
