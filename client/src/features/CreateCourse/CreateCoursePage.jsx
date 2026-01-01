import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CourseInfo, Curriculum, CourseTabs } from './components/Index'
import { courseService } from '../../service/apiService'

const CreateCoursePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('course')
  const [courseId, setCourseId] = useState(null)
  const [isCreatingCourse, setIsCreatingCourse] = useState(false)
  
  const [formData, setFormData] = useState({
    // Course Info (merged Basic + Content + Settings)
    title: '',
    description: '',
    thumbnailUrl: '',
    why: '',
    requirements: [''],
    whatYouWillLearn: [''],
    tags: [''],
    level: 'BEGINNER',
    priceAmount: '',
    currency: 'VND',
    publication: 'DRAFT',
    // Curriculum
    sections: []
  })

  // Success notification state
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  const tabs = [
    { id: 'course', label: 'Course', disabled: false },
    { id: 'curriculum', label: 'Curriculum', disabled: !courseId }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleListAdd = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const handleListRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleListChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const validateCourseForm = () => {
    const errors = []
    
    if (!formData.title?.trim()) errors.push('Course title')
    if (!formData.thumbnailUrl?.trim()) errors.push('Thumbnail')
    if (!formData.description?.trim()) errors.push('Description')
    if (!formData.why?.trim()) errors.push('Why choose this course')
    if (formData.priceAmount === '' || formData.priceAmount < 0) errors.push('Price')

    return errors
  }

  const handleSaveCourse = async () => {
    const errors = validateCourseForm()
    
    if (errors.length > 0) {
      alert(`Please fill in the following required fields:\n- ${errors.join('\n- ')}`)
      return
    }

    try {
      setIsCreatingCourse(true)
      
      // Call API to create course
      const response = await courseService.createCourse({
        title: formData.title,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl,
        whyChooseThisCourse: formData.why,
        requirements: formData.requirements.filter(r => r.trim()),
        whatYouWillLearn: formData.whatYouWillLearn.filter(w => w.trim()),
        tags: formData.tags.filter(t => t.trim()),
        level: formData.level,
        price: {
          amount: Number(formData.priceAmount),
          currency: formData.currency
        },
        state: formData.publication
      })

      console.log('✅ Course created:', response)
      
      // Save courseId from response
      const newCourseId = response._id
      setCourseId(newCourseId)

      // Show success notification
      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 2000)

      // Auto switch to Curriculum tab
      setTimeout(() => {
        setActiveTab('curriculum')
      }, 2000)

    } catch (error) {
      console.error('❌ Failed to create course:', error)
      alert('Failed to create course. Please try again.')
    } finally {
      setIsCreatingCourse(false)
    }
  }

  const handleCancel = () => {
    navigate('/tutor-now')
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'curriculum' && !courseId) {
      alert('Please save the course first before adding curriculum')
      return
    }
    setActiveTab(tabId)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'course':
        return (
          <CourseInfo
            formData={formData}
            onInputChange={handleInputChange}
            onListAdd={handleListAdd}
            onListRemove={handleListRemove}
            onListChange={handleListChange}
          />
        )
      case 'curriculum':
        return (
          <Curriculum
            formData={formData}
            onInputChange={handleInputChange}
            courseId={courseId}
          />
        )
      default:
        return (
          <CourseInfo
            formData={formData}
            onInputChange={handleInputChange}
            onListAdd={handleListAdd}
            onListRemove={handleListRemove}
            onListChange={handleListChange}
          />
        )
    }
  }

  const renderContent = () => {
    return (
      <div className="space-y-6">
        {renderTabContent()}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          {/* Finish button - Show when course is created */}
          {courseId && (
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Finish & View Course
            </button>
          )}

          {/* Save Course button - Only show on Course tab */}
          {activeTab === 'course' && (
            <div className="flex justify-end flex-1">
              {courseId ? (
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Course Saved - You can now add curriculum</span>
                </div>
              ) : (
                <button
                  onClick={handleSaveCourse}
                  disabled={isCreatingCourse}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  {isCreatingCourse ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Course...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Save Course
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-2">Create New Course</h1>
              <p className="text-gray-500">Fill in the details to create your course</p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <CourseTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Content Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
          {renderContent()}
        </div>
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-fadeInUp">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Created Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Your course &quot;{formData.title || 'New Course'}&quot; has been created successfully.
            </p>
            <p className="text-sm text-green-600 font-medium">
              Switching to Curriculum tab...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateCoursePage
