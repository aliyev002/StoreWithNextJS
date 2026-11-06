'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { showToast } from '@/app/components/Toast'
import { Store, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()

    if (password.length < 6) {
      showToast('Şifrə minimum 6 simvoldan ibarət olmalıdır', 'error')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })

      setLoading(false)

      if (res.ok) {
        showToast('Qeydiyyat uğurla tamamlandı! Zəhmət olmasa daxil olun.', 'success')
        router.push('/signin')
      } else {
        const data = await res.json()
        showToast(data.error || 'Qeydiyyat zamanı xəta baş verdi', 'error')
      }
    } catch (err) {
      setLoading(false)
      showToast('Şəbəkə xətası baş verdi', 'error')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-neutral-900/10">
            <Store className="w-6 h-6 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Yeni Hesab Yarat
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Alış-verişə başlamaq üçün pulsuz qeydiyyatdan keçin
          </p>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Elektron Poçt
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="adiniz@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Şifrə
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 simvol"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Qeydiyyat edilir...</span>
                  </>
                ) : (
                  <>
                    <span>Hesab yarat</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs sm:text-sm text-neutral-500">
          Artıq hesabınız var?{' '}
          <Link href="/signin" className="font-semibold text-neutral-900 hover:underline">
            Daxil olun
          </Link>
        </p>
      </div>
    </div>
  )
}
