const FilterTrigger = ({ onClick, activeCount = 0 }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 shadow-sm hover:bg-gray-50 transition-colors"
      aria-label="Open filters"
      aria-expanded={false}
      title="Filters"
    >
      {/* Funnel icon */}
      <svg 
        className="w-5 h-5 text-gray-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
        />
      </svg>

      {/* Active filter count badge */}
      {activeCount > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-600 px-1.5 text-xs font-medium text-white">
          {activeCount}
        </span>
      )}
    </button>
  )
}

export default FilterTrigger