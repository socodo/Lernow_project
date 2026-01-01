import { useState } from 'react'
import { fileService } from '../../../service/apiService'
import DynamicList from './DynamicList'

const CourseInfo = ({ formData, onInputChange, onListAdd, onListRemove, onListChange }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [touched, setTouched] = useState({})

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const hasError = (field) => {
    return touched[field] && (!formData[field] || formData[field].trim() === '')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('files', file)

    try {
      setIsUploading(true)
      const response = await fileService.upload(uploadData)

      if (response && response.files && response.files.length > 0) {
        onInputChange('thumbnailUrl', response.files[0].url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Course Details Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-4">Course Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`w-full rounded-lg bg-gray-50 px-3 py-2 border focus:ring-2 focus:bg-white transition-colors text-sm ${
                hasError('title')
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
              placeholder="Enter course title"
            />
            {hasError('title') && (
              <p className="text-red-500 text-xs mt-1">Course title is required</p>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {formData.thumbnailUrl ? (
                <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden group">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Course thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => onInputChange('thumbnailUrl', '')}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <label className={`flex flex-row items-center justify-center w-full px-3 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors h-[42px] ${
                  !formData.thumbnailUrl && touched.thumbnailUrl ? 'border-red-500' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span className="text-sm text-gray-500">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-500">Click to upload thumbnail</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
              {!formData.thumbnailUrl && touched.thumbnailUrl && (
                <p className="text-red-500 text-xs">Thumbnail is required</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-4">Course Content</h3>
        
        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            className={`w-full rounded-lg bg-gray-50 px-3 py-2 border focus:ring-2 focus:bg-white transition-colors resize-none text-sm ${
              hasError('description')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-blue-500'
            }`}
            placeholder="Describe your course"
          />
          {hasError('description') && (
            <p className="text-red-500 text-xs mt-1">Description is required</p>
          )}
        </div>

        {/* Why Choose This Course */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why choose this course? <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.why}
            onChange={(e) => onInputChange('why', e.target.value)}
            onBlur={() => handleBlur('why')}
            className={`w-full rounded-lg bg-gray-50 px-3 py-2 border focus:ring-2 focus:bg-white transition-colors resize-none text-sm ${
              hasError('why')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-blue-500'
            }`}
            placeholder="Explain the benefits and outcomes"
          />
          {hasError('why') && (
            <p className="text-red-500 text-xs mt-1">This field is required</p>
          )}
        </div>

        {/* Dynamic Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicList
            title="Requirements"
            field="requirements"
            formData={formData}
            placeholder="Enter a requirement"
            onListAdd={onListAdd}
            onListRemove={onListRemove}
            onListChange={onListChange}
          />
          
          <DynamicList
            title="What You Will Learn"
            field="whatYouWillLearn"
            formData={formData}
            placeholder="Enter a learning outcome"
            onListAdd={onListAdd}
            onListRemove={onListRemove}
            onListChange={onListChange}
          />
        </div>

        {/* Tags */}
        <div className="mt-4">
          <DynamicList
            title="Tags"
            field="tags"
            formData={formData}
            placeholder="Enter a tag (e.g., React, TypeScript)"
            onListAdd={onListAdd}
            onListRemove={onListRemove}
            onListChange={onListChange}
          />
        </div>
      </div>

      {/* Course Settings Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-4">Course Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level <span className="text-red-500">*</span>
            </label>
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

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.priceAmount}
              onChange={(e) => onInputChange('priceAmount', e.target.value)}
              onBlur={() => handleBlur('priceAmount')}
              className={`w-full rounded-lg bg-gray-50 px-3 py-2 border focus:ring-2 focus:bg-white transition-colors text-sm ${
                hasError('priceAmount')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-blue-500'
              }`}
              placeholder="Enter price (0 for free course)"
              min="0"
            />
            {hasError('priceAmount') && (
              <p className="text-red-500 text-xs mt-1">Price is required</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseInfo
