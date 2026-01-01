import { useState } from 'react'

const LikeButton = ({ liked, onToggle, className = '' }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  
  const handleClick = (e) => {
    e.stopPropagation()
    setIsAnimating(true)
    onToggle()
    setTimeout(() => setIsAnimating(false), 200)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={liked ? 'Remove from liked courses' : 'Add to liked courses'}
      className={`absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition-colors ${className}`}
    >
      <style jsx>{`
        @keyframes pop {
          0% { transform: scale(0.8); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 200ms ease-out;
        }
      `}</style>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? '#f472b6' : 'none'}
        stroke={liked ? '#f472b6' : '#6b7280'}
        strokeWidth="2"
        className={isAnimating && liked ? 'animate-pop' : ''}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  )
}

export default LikeButton