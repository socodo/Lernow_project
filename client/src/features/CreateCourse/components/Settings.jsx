const Settings = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      {/* Course Properties Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Course Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => onInputChange('language', e.target.value)}
              className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
              placeholder="e.g., English, Vietnamese"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={formData.level}
              onChange={(e) => onInputChange('level', e.target.value)}
              className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Publication Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Publication Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Publication Status</label>
          <select
            value={formData.publication}
            onChange={(e) => onInputChange('publication', e.target.value)}
            className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
          >
            <option value="Draft">Draft</option>
            <option value="Unlisted">Unlisted</option>
            <option value="Published">Published</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Draft: Only you • Unlisted: Direct link • Published: Public
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings