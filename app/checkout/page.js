import CheckoutForm from './CheckoutForm'

export const metadata = {
  title: 'Sifarişi Tamamla — Mağaza',
}

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Sifarişin Rəsmiləşdirilməsi
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Sifarişi tamamlamaq üçün çatdırılma məlumatlarını təsdiqləyin
        </p>
      </div>

      <CheckoutForm />
    </div>
  )
}
