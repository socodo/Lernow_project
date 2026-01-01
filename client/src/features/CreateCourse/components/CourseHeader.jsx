const CourseHeader = ({ onCancel, onSave, canSave, tabsSaved }) => {
  const savedTabsCount = Object.values(tabsSaved).filter(saved => saved).length
  const totalTabs = Object.keys(tabsSaved).length

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">Create New Course</h1>
        <p className="text-gray-500">Fill in the details to create your course</p>
        {savedTabsCount > 0 && (
          <div className="mt-2 text-sm text-blue-600">
            Progress: {savedTabsCount}/{totalTabs} sections completed
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
            canSave
              ? 'bg-sky-600 hover:bg-sky-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={!canSave ? 'Please save all sections before saving the course' : 'Save course'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {canSave ? 'Save Course' : `Save Course (${savedTabsCount}/${totalTabs})`}
        </button>
      </div>
    </div>
  )
}

export default CourseHeader