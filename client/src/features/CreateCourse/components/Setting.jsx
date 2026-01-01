const Settings = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      {/* Course Properties Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Course Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={formData.language}
              onChange={(e) => onInputChange('language', e.target.value)}
              className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
            >
              <option value="en">English</option>
              <option value="vi">Vietnamese</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={formData.level}
              onChange={(e) => onInputChange('level', e.target.value)}
              className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing & Publication Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Price & State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={formData.price.amount}
                onChange={(e) => onInputChange('price', { ...formData.price, amount: e.target.value })}
                className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.price.currency}
                onChange={(e) => onInputChange('price', { ...formData.price, currency: e.target.value })}
                className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publication Status</label>
            <select
              value={formData.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Draft: Only you • Archived: Unlisted • Published: Public
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings