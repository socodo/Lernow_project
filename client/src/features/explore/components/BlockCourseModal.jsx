import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const BlockCourseModal = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState('')
  const modalRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
      
      // Focus the textarea when modal opens
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('mousedown', handleClickOutside)
        document.body.style.overflow = 'unset'
      }
    }
  }, [open, onClose])

  const handleConfirm = () => {
    onConfirm(reason)
    setReason('')
  }

  const handleCancel = () => {
    setReason('')
    onClose()
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 transition-all duration-150 ease-out scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-modal-title"
      >
        <div className="mb-4">
          <h2 id="block-modal-title" className="text-xl font-semibold text-gray-900 mb-2">
            Why are you blocking this course?
          </h2>
          <p className="text-sm text-gray-600">
            Please let us know why you want to block this course. This helps us improve our content recommendations.
          </p>
        </div>

        <div className="mb-6">
          <textarea
            ref={textareaRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us why you're blocking this course..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-sky-500 min-h-[120px] resize-none"
            rows="4"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Block Course
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default BlockCourseModal