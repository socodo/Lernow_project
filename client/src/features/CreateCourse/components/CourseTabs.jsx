const CourseTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => {
        const isDisabled = tab.disabled || false
        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            disabled={isDisabled}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border flex items-center gap-2 ${
              isDisabled
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : activeTab === tab.id
                ? 'bg-gray-100 border-gray-300 text-gray-900'
                : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {isDisabled && (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default CourseTabs