const DynamicList = ({ title, field, formData, placeholder, onListAdd, onListRemove, onListChange }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {formData[field].map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onListChange(field, index, e.target.value)}
              className="flex-1 rounded-xl bg-gray-100/70 px-4 py-3 border-0 focus:ring-2 focus:ring-sky-500 focus:bg-white transition-colors"
              placeholder={placeholder}
            />
            {formData[field].length > 1 && (
              <button
                onClick={() => onListRemove(field, index)}
                className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => onListAdd(field)}
          className="text-sky-600 hover:text-sky-700 font-medium text-sm flex items-center gap-2 mt-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {title.slice(0, -1)}
        </button>
      </div>
    </div>
  )
}

export default DynamicList
