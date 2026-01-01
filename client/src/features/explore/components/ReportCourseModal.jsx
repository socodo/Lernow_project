import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const ReportCourseModal = ({ open, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('')
  const modalRef = useRef(null)

  const reasons = [
    { key: 'copyright', label: 'Copyright Infringement' },
    { key: 'fake', label: 'Fake / Fraudulent' },
    { key: 'inappropriate', label: 'Inappropriate Content' },
    { key: 'spam', label: 'Spam / Advertisement' },
    { key: 'misleading', label: 'Misleading Information' },
    { key: 'other', label: 'Other' }
  ]

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

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('mousedown', handleClickOutside)
        document.body.style.overflow = 'unset'
      }
    }
  }, [open, onClose])

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason)
      setSelectedReason('')
    }
  }

  const handleCancel = () => {
    setSelectedReason('')
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
        aria-labelledby="report-modal-title"
      >
        <div className="mb-4">
          <h2 id="report-modal-title" className="text-xl font-semibold text-gray-900 mb-2">
            Report Course
          </h2>
          <p className="text-sm text-gray-600">
            Please let us know why you're reporting this course. All reports will be carefully reviewed.
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {reasons.map((reason) => (
            <label
              key={reason.key}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
            >
              <input
                type="radio"
                name="reportReason"
                value={reason.key}
                checked={selectedReason === reason.key}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{reason.label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ReportCourseModal