import { getUserFromCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Hash, Package, ShieldCheck, ArrowRight } from 'lucide-react'

export default async function ProfilePage() {
  const user = await getUserFromCookie()
  if (!user) redirect('/signin')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { _count: { select: { orders: true } } },
  })

  if (!dbUser) {
    redirect('/signin')
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-neutral-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Şəxsi Hesab
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          İstifadəçi profiliniz və sifariş fəaliyyətiniz
        </p>
      </div>

      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* User Card */}
        <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-neutral-900/10">
            {dbUser.email[0]}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">{dbUser.email}</h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aktiv istifadəçi</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 sm:p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Ümumi Sifariş
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 block mt-1">
              {dbUser._count.orders}
            </span>
          </div>

          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 sm:p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              İstifadəçi ID
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-neutral-900 block mt-1">
              #{dbUser.id}
            </span>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 bg-neutral-50/70 rounded-xl text-xs sm:text-sm">
            <span className="text-neutral-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-400" />
              Elektron poçt
            </span>
            <span className="font-semibold text-neutral-900">{dbUser.email}</span>
          </div>
          <div className="flex items-center justify-between p-3.5 bg-neutral-50/70 rounded-xl text-xs sm:text-sm">
            <span className="text-neutral-500 flex items-center gap-2">
              <Hash className="w-4 h-4 text-neutral-400" />
              Hesab nömrəsi
            </span>
            <span className="font-semibold text-neutral-900">ID-{dbUser.id}</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/orders"
            className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Sifariş tarixçəsinə bax</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
