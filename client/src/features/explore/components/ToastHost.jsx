import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 2800)

    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  const handleClose = () => {
    onClose(toast.id)
  }

  return (
    <div className="pointer-events-auto mt-3 flex items-center gap-3 rounded-xl bg-emerald-600 text-white px-4 py-3 shadow-lg animate-slide-in">
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.msg}</p>
      </div>
      <button
        onClick={handleClose}
        aria-label="Close notification"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-emerald-700 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}

const ToastHost = ({ toasts, onClose }) => {
  if (!toasts.length) return null

  return createPortal(
    <>
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={onClose}
          />
        ))}
      </div>
    </>,
    document.body
  )
}

export default ToastHost