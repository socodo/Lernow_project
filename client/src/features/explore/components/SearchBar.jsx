const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="relative w-full">
      {/* Left magnifier icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>

      {/* Search input */}
      <input
        type="text"
        className="w-full rounded-2xl bg-white/95 backdrop-blur-sm px-12 py-4 border border-gray-200 shadow-lg focus:shadow-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 text-base"
        placeholder="Search courses, instructors, or tags…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      {/* Right clear button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 p-2 z-10"
          aria-label="Clear search"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchBar