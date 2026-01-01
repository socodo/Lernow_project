import DynamicList from './DynamicList'

const Content = ({ formData, onInputChange, onListAdd, onListRemove, onListChange }) => {
  return (
    <div className="space-y-4">
      {/* Learning Content Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Learning Content</h3>
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
      </div>
      
      {/* Course Metadata Section */}
      {/* <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-2">Course Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DynamicList
            title="Tags"
            field="tags"
            formData={formData}
            placeholder="Enter a tag"
            onListAdd={onListAdd}
            onListRemove={onListRemove}
            onListChange={onListChange}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Policy</label>
            <textarea
              rows={3}
              value={formData.refundPolicy}
              onChange={(e) => onInputChange('refundPolicy', e.target.value)}
              className="w-full rounded-lg bg-gray-50 px-3 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none text-sm"
              placeholder="Describe your refund policy"
            />
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Content