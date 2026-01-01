const FilterPanel = ({ open, onClose, value, onChange, onReset }) => {
  const categories = ['IT', 'Business', 'Language', 'Design', 'Marketing', 'Personal Development']
  const levels = ['Beginner', 'Intermediate', 'Advanced']

  if (!open) return null

  const handleCategoryChange = (category) => {
    const newCategories = value.categories.includes(category)
      ? value.categories.filter(c => c !== category)
      : [...value.categories, category]
    
    onChange({ ...value, categories: newCategories })
  }

  const handleLevelChange = (level) => {
    onChange({ ...value, level: value.level === level ? null : level })
  }

  const handlePriceChange = (priceType) => {
    onChange({ ...value, price: value.price === priceType ? null : priceType })
  }

  const handleRatingChange = (rating) => {
    onChange({ ...value, rating: value.rating === rating ? null : rating })
  }

  const handlePriceRangeChange = (priceRange) => {
    onChange({ ...value, priceRange: parseInt(priceRange) })
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Filter panel */}
      <div className={`
        fixed z-50 bg-white overflow-y-auto
        ${/* Mobile: full screen */ ''}
        sm:inset-0
        ${/* Desktop: right drawer */ ''}
        md:right-4 md:top-20 md:bottom-6 md:inset-auto md:w-[360px] md:rounded-2xl md:border md:border-gray-200 md:shadow-xl
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close filters"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4 md:px-6 space-y-6">
          {/* Category Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Category</h3>
            <div className="space-y-1.5">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 focus:ring-offset-0"
                    checked={value.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Level Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Level</h3>
            <div className="space-y-1.5">
              {levels.map(level => (
                <label key={level} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="level"
                    className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500 focus:ring-offset-0"
                    checked={value.level === level}
                    onChange={() => handleLevelChange(level)}
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Price</h3>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500 focus:ring-offset-0"
                  checked={value.price === 'free'}
                  onChange={() => handlePriceChange('free')}
                />
                <span className="text-sm text-gray-700">Free</span>
              </label>
              <label className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500 focus:ring-offset-0"
                  checked={value.price === 'paid'}
                  onChange={() => handlePriceChange('paid')}
                />
                <span className="text-sm text-gray-700">Paid</span>
              </label>
            </div>
          </div>

          {/* Rating Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Rating</h3>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500 focus:ring-offset-0"
                    checked={value.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-700">{rating}</span>
                    <div className="flex">
                      {[...Array(rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Price Range</h3>
            <div className="px-1">
              <input
                type="range"
                min="0"
                max="100"
                value={value.priceRange || 50}
                onChange={(e) => handlePriceRangeChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>${value.priceRange || 50}</span>
                <span>$100+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterPanel