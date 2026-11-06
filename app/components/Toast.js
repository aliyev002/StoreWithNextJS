'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

let toastQueue = []
let listeners = []

export function showToast(message, type = 'success') {
  const id = Date.now() + Math.random()
  toastQueue = [...toastQueue, { id, message, type }]
  listeners.forEach(fn => fn([...toastQueue]))
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id)
    listeners.forEach(fn => fn([...toastQueue]))
  }, 3500)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter(fn => fn !== setToasts)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error'

        return (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-4 py-3 bg-white/95 backdrop-blur border border-neutral-200/90 rounded-xl shadow-lg shadow-neutral-900/5 text-neutral-800 text-sm font-medium pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-600" />}
            </div>
            <p className="flex-1 text-xs sm:text-sm text-neutral-700">{toast.message}</p>
            <button
              onClick={() => {
                toastQueue = toastQueue.filter(t => t.id !== toast.id)
                setToasts([...toastQueue])
              }}
              className="text-neutral-400 hover:text-neutral-600 p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
