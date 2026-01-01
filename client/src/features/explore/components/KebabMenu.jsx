import { useState, useRef, useEffect } from 'react'

const KebabMenu = ({ items, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  const handleToggle = (e) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const handleItemClick = (e, item) => {
    e.stopPropagation()
    item.onClick()
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        aria-label="Course options"
        aria-expanded={isOpen}
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="12" cy="5" r="1"/>
          <circle cx="12" cy="19" r="1"/>
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-3 top-12 z-30 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg transition-all duration-150 ease-out"
          data-open={isOpen}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e) => handleItemClick(e, item)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${
                item.className || 'hover:bg-gray-50 text-gray-700'
              }`}
              aria-label={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default KebabMenu