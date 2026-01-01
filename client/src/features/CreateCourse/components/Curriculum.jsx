import React, { useState, useEffect } from 'react'
import { fileService } from '../../../service/apiService'
import { sectionService, lessonService } from '../../../service/curriculumService'

// SectionCard Component  
const SectionCard = ({ section, sectionIndex, onUpdate, onDelete, onAddLesson, allSections, onUpdateTitle, onFinishEditing, onUpdateLesson, onSubmitLesson, onEditLesson, onDeleteLesson, isSavingSection }) => {
  const [validationError, setValidationError] = useState("")
  const [uploadingLessonId, setUploadingLessonId] = useState(null)

  const handleFileUpload = async (e, lessonId) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('files', file)

    try {
      setUploadingLessonId(lessonId)
      const response = await fileService.upload(uploadData)

      if (response && response.files && response.files.length > 0) {
        onUpdateLesson(section.id, lessonId, { 
          videoUrl: response.files[0].url,
          videoPublicId: response.files[0].public_id  // ← Lưu public_id để xóa
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploadingLessonId(null)
    }
  }

  const handleDeleteVideo = async (lessonId, publicId) => {
    console.log('🗑️ FE: Delete button clicked')
    console.log('📋 FE: lessonId:', lessonId)
    console.log('📋 FE: publicId:', publicId)
    
    if (!publicId) {
      console.log('❌ FE: No publicId, skipping delete')
      alert('Cannot delete: No public ID found')
      return
    }

    console.log('🔥 FE: Calling fileService.delete with:', publicId)
    
    try {
      const response = await fileService.delete(publicId)
      console.log('✅ FE: Delete response:', response)
      onUpdateLesson(section.id, lessonId, { videoUrl: "", videoPublicId: "" })
    } catch (error) {
      console.error('❌ FE: Delete failed:', error)
      alert('Failed to delete video. Please try again.')
    }
  }

  const validateTitle = (title) => {
    const trimmedTitle = title.trim()

    // Check if empty
    if (!trimmedTitle) {
      return "Section title cannot be empty"
    }

    // Check for duplicates (exclude current section by ID)
    const isDuplicate = allSections.some((sec) =>
      sec.id !== section.id &&
      sec.sectionTitle.trim().toLowerCase() === trimmedTitle.toLowerCase()
    )

    if (isDuplicate) {
      return "Section title must be unique"
    }

    return ""
  }

  const handleTitleChange = (title) => {
    onUpdateTitle(section.id, title)

    // Clear validation error when typing
    if (validationError) {
      setValidationError("")
    }
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const error = validateTitle(section.sectionTitle)
      setValidationError(error)

      if (!error && section.sectionTitle.trim()) {
        onFinishEditing(section.id)
      }
    }
  }

  const handleTitleBlur = () => {
    const error = validateTitle(section.sectionTitle)
    setValidationError(error)

    if (!error && section.sectionTitle.trim()) {
      onFinishEditing(section.id)
    }
  }

  const handleAddLessonClick = () => {
    onAddLesson(section.id)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4 transition-all ease-in-out duration-300">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-1 mr-2 gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={section.sectionTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className={`text-xl font-semibold bg-white border-2 outline-none rounded-lg px-4 py-3 w-full transition-colors duration-200 shadow-sm ${validationError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
                }`}
              placeholder={section.sectionTitle ? "Section title" : "New Section"}
            />
            {validationError && (
              <p className="text-red-500 text-sm mt-1 px-2">
                {validationError}
              </p>
            )}
          </div>
          {section.isEditing && section.sectionTitle.trim() && (
            <button
              onClick={() => handleTitleBlur()}
              disabled={!!validationError || isSavingSection}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${validationError || isSavingSection
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              {isSavingSection ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isSavingSection ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!section.isEditing && section.sectionTitle.trim() && (
            <button
              onClick={handleAddLessonClick}
              className="border border-blue-500 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Lesson
            </button>
          )}
          <button
            onClick={() => onDelete(sectionIndex)}
            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete section"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Section Stats - Only show when not editing */}
      {!section.isEditing && section.sectionTitle.trim() && (
        <div className="text-sm text-gray-600">
          {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Lessons - Only show when not editing */}
      {!section.isEditing && section.sectionTitle.trim() && (
        <div className="space-y-3">
          {section.lessons.map((lesson, lessonIndex) => (
            <div key={lesson.id}>
              {lesson.isEditing ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); onSubmitLesson(section.id, lesson.id); }}
                  className="space-y-3 bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                >
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Lesson title"
                    value={lesson.title}
                    onChange={e => onUpdateLesson(section.id, lesson.id, { title: e.target.value })}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={lesson.type}
                      onChange={e => onUpdateLesson(section.id, lesson.id, { type: e.target.value })}
                    >
                      <option>Video</option>
                      <option>File</option>
                    </select>

                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2"
                      rows={2}
                      placeholder="Short description…"
                      value={lesson.description}
                      onChange={e => onUpdateLesson(section.id, lesson.id, { description: e.target.value })}
                    />

                    {lesson.type === "Video" ? (
                      <div className="md:col-span-2">
                        {lesson.videoUrl ? (
                          <div className="relative w-full p-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                            <span className="text-sm text-gray-600 truncate max-w-[80%]">{lesson.videoUrl}</span>
                            <button
                              type="button"
                              onClick={() => {
                                console.log('🖱️ DELETE BUTTON CLICKED!')
                                console.log('Lesson object:', lesson)
                                console.log('videoPublicId:', lesson.videoPublicId)
                                handleDeleteVideo(lesson.id, lesson.videoPublicId)
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Delete video from storage"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-row items-center justify-center w-full px-3 py-2 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors h-[42px]">
                            <div className="flex items-center gap-2">
                              {uploadingLessonId === lesson.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                  <span className="text-sm text-gray-500">Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <span className="text-sm text-gray-500">Click to upload video</span>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="video/*"
                              onChange={(e) => handleFileUpload(e, lesson.id)}
                              disabled={uploadingLessonId === lesson.id}
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:col-span-2 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={e => onUpdateLesson(section.id, lesson.id, { fileName: e.target.files?.[0]?.name })}
                      />
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium">Submit</button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                      onClick={() => onSubmitLesson(section.id, lesson.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                      <p className="text-sm text-gray-500">{lesson.description || "No description"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
                        onClick={() => onEditLesson(section.id, lesson.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium"
                        onClick={() => onDeleteLesson(section.id, lesson.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-4 items-center">
                    <span><span className="font-medium">Type:</span> {lesson.type}</span>
                    {lesson.type === "Video" && lesson.videoUrl ? (
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[360px]"><span className="font-medium">URL:</span> {lesson.videoUrl}</span>
                        {lesson.videoPublicId && (
                          <button
                            type="button"
                            onClick={() => {
                              console.log('🖱️ DELETE VIDEO BUTTON CLICKED (View Mode)!')
                              console.log('Lesson:', lesson)
                              console.log('videoPublicId:', lesson.videoPublicId)
                              handleDeleteVideo(lesson.id, lesson.videoPublicId)
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete video from Cloudinary"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      lesson.fileName && <span><span className="font-medium">File:</span> {lesson.fileName}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instruction text when editing */}
      {section.isEditing && (
        <div className="text-sm text-gray-500 italic bg-blue-50 border border-blue-200 rounded-lg p-3">
          💡 Enter section title and press Enter to continue adding lessons
        </div>
      )}
    </div>
  )
}

const Curriculum = ({ formData, onInputChange, courseId }) => {
  // Get sections from formData or initialize empty array
  const sections = formData.sections || []
  const [isLoadingSections, setIsLoadingSections] = useState(false)
  const [isCreatingSection, setIsCreatingSection] = useState(false)
  const [isSavingSection, setIsSavingSection] = useState(false)

  // Load existing sections on mount
  useEffect(() => {
    if (courseId) {
      loadSections()
    }
  }, [courseId])

  const loadSections = async () => {
    try {
      setIsLoadingSections(true)
      const response = await sectionService.getSectionsByCourse(courseId)
      
      if (response.sections) {
        // Transform backend sections to frontend format
        const transformedSections = response.sections.map(section => ({
          id: section._id,
          backendId: section._id, // Keep track of backend ID
          sectionTitle: section.title,
          orderNo: section.orderNo,
          lessons: [],
          isEditing: false,
          createdAt: section.createdAt
        }))
        
        onInputChange('sections', transformedSections)
      }
    } catch (error) {
      console.error('Failed to load sections:', error)
      alert('Failed to load sections. Please refresh the page.')
    } finally {
      setIsLoadingSections(false)
    }
  }

  const createEmptySection = () => ({
    id: crypto.randomUUID(),
    sectionTitle: "",
    lessons: [],
    isEditing: true,
    createdAt: Date.now()
  })

  const createEmptyLesson = () => ({
    id: crypto.randomUUID(),
    title: "",
    type: "Video",
    duration: 0,
    description: "",
    videoUrl: "",
    videoPublicId: "",
    fileName: "",
    isEditing: true,
    createdAt: Date.now()
  })

  const handleAddSection = async () => {
    // Create empty section in UI first for immediate feedback
    const newSection = createEmptySection()
    const updatedSections = [newSection, ...sections]
    onInputChange('sections', updatedSections)
  }

  const updateSectionTitle = (sectionId, newTitle) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, sectionTitle: newTitle } : section
    )
    onInputChange('sections', updatedSections)
  }

  const finishEditing = async (sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    
    if (!section || !section.sectionTitle.trim()) {
      alert('Section title is required')
      return
    }

    // Prevent concurrent saves
    if (isSavingSection) {
      console.log('Already saving a section, please wait...')
      return
    }

    try {
      setIsSavingSection(true)
      
      // If section doesn't have backendId, it means it's new - create it
      if (!section.backendId) {
        // Get all existing sections from backend to calculate correct orderNo
        const existingSectionsResponse = await sectionService.getSectionsByCourse(courseId)
        const existingSections = existingSectionsResponse.sections || []
        
        // Find max orderNo from backend
        const maxOrderNo = existingSections.reduce((max, s) => Math.max(max, s.orderNo || 0), 0)
        
        console.log('Creating section with orderNo:', maxOrderNo + 1)
        console.log('Existing sections count:', existingSections.length)
        
        const response = await sectionService.createSection({
          courseId,
          title: section.sectionTitle.trim(),
          orderNo: maxOrderNo + 1
        })

        // Update section with backend ID
        const updatedSections = sections.map(s =>
          s.id === sectionId 
            ? { 
                ...s, 
                backendId: response._id,
                orderNo: response.orderNo,
                isEditing: false 
              } 
            : s
        )
        onInputChange('sections', updatedSections)
      } else {
        // Update existing section
        await sectionService.updateSection(section.backendId, {
          title: section.sectionTitle.trim()
        })

        const updatedSections = sections.map(s =>
          s.id === sectionId ? { ...s, isEditing: false } : s
        )
        onInputChange('sections', updatedSections)
      }
    } catch (error) {
      console.error('Failed to save section:', error)
      alert('Failed to save section. Please try again.')
    } finally {
      setIsSavingSection(false)
    }
  }

  const handleUpdateSection = (sectionIndex, updatedSection) => {
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex ? updatedSection : section
    )
    onInputChange('sections', updatedSections)
  }

  const handleDeleteSection = async (sectionIndex) => {
    const section = sections[sectionIndex]
    
    if (!confirm(`Delete section "${section.sectionTitle}"? This will also delete all lessons in this section.`)) {
      return
    }

    try {
      // If section has backend ID, delete from backend
      if (section.backendId) {
        await sectionService.deleteSection(section.backendId)
      }

      // Remove from UI
      const updatedSections = sections.filter((_, index) => index !== sectionIndex)
      onInputChange('sections', updatedSections)
    } catch (error) {
      console.error('Failed to delete section:', error)
      alert('Failed to delete section. Please try again.')
    }
  }

  const handleAddLesson = async (sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    
    if (!section?.backendId) {
      alert('Please save the section first before adding lessons')
      return
    }

    // Load lessons for this section if not already loaded
    if (!section.lessonsLoaded) {
      try {
        const response = await lessonService.getLessonsBySection(section.backendId)
        
        const transformedLessons = response.lessons.map(lesson => ({
          id: lesson._id,
          backendId: lesson._id,
          title: lesson.title,
          type: lesson.lessonType === 'VIDEO' ? 'Video' : 'File',
          description: lesson.shortDesc || '',
          videoUrl: lesson.url || '',
          videoPublicId: lesson.publicId || '',
          orderNo: lesson.orderNo,
          isEditing: false,
          createdAt: lesson.createdAt
        }))

        const updatedSections = sections.map(s =>
          s.id === sectionId 
            ? { ...s, lessons: transformedLessons, lessonsLoaded: true } 
            : s
        )
        onInputChange('sections', updatedSections)
      } catch (error) {
        console.error('Failed to load lessons:', error)
      }
    }

    // Add empty lesson to UI
    const updatedSections = sections.map(s =>
      s.id === sectionId
        ? { ...s, lessons: [createEmptyLesson(), ...s.lessons] }
        : s
    )
    onInputChange('sections', updatedSections)
  }

  const updateLesson = (sectionId, lessonId, updates) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? {
          ...section,
          lessons: section.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, ...updates } : lesson
          )
        }
        : section
    )
    onInputChange('sections', updatedSections)
  }

  // Lesson handlers theo mẫu
  const submitLesson = async (sectionId, lessonId) => {
    const section = sections.find(s => s.id === sectionId)
    const lesson = section?.lessons.find(l => l.id === lessonId)

    if (!lesson?.title.trim()) {
      alert("Please enter a lesson title")
      return
    }

    if (!section?.backendId) {
      alert("Section must be saved first")
      return
    }

    try {
      // If lesson doesn't have backendId, create it
      if (!lesson.backendId) {
        // Get all existing lessons from backend to calculate correct orderNo
        const existingLessonsResponse = await lessonService.getLessonsBySection(section.backendId)
        const existingLessons = existingLessonsResponse.lessons || []
        
        // Find max orderNo from backend
        const maxOrderNo = existingLessons.reduce((max, l) => Math.max(max, l.orderNo || 0), 0)

        const response = await lessonService.createLesson({
          courseId,
          sectionId: section.backendId,
          title: lesson.title.trim(),
          shortDesc: lesson.description?.trim() || '',
          orderNo: maxOrderNo + 1,
          lessonType: lesson.type === 'Video' ? 'VIDEO' : 'FILE',
          url: lesson.videoUrl || '',
          publicId: lesson.videoPublicId || '',
          isVisible: true
        })

        // Update lesson with backend ID
        const updatedSections = sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                lessons: s.lessons.map(l =>
                  l.id === lessonId
                    ? {
                        ...l,
                        backendId: response._id,
                        orderNo: response.orderNo,
                        isEditing: false
                      }
                    : l
                )
              }
            : s
        )
        onInputChange('sections', updatedSections)
      } else {
        // Update existing lesson
        await lessonService.updateLesson(lesson.backendId, {
          title: lesson.title.trim(),
          shortDesc: lesson.description?.trim() || '',
          url: lesson.videoUrl || '',
          publicId: lesson.videoPublicId || ''
        })

        const updatedSections = sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                lessons: s.lessons.map(l =>
                  l.id === lessonId ? { ...l, isEditing: false } : l
                )
              }
            : s
        )
        onInputChange('sections', updatedSections)
      }
    } catch (error) {
      console.error('Failed to save lesson:', error)
      alert('Failed to save lesson. Please try again.')
    }
  }

  const editLesson = (sectionId, lessonId) => {
    const updatedSections = sections.map(s =>
      s.id !== sectionId ? s : ({
        ...s,
        lessons: s.lessons.map(l =>
          l.id === lessonId ? { ...l, isEditing: true } : l
        )
      })
    )
    onInputChange('sections', updatedSections)
  }

  const deleteLesson = async (sectionId, lessonId) => {
    const section = sections.find(s => s.id === sectionId)
    const lesson = section?.lessons.find(l => l.id === lessonId)
    
    if (!lesson) return

    if (!confirm(`Delete lesson "${lesson.title}"?`)) {
      return
    }

    try {
      // If lesson has video, delete from Cloudinary first
      if (lesson.videoPublicId) {
        console.log('🗑️ Deleting video from Cloudinary')
        try {
          await fileService.delete(lesson.videoPublicId)
          console.log('✅ Video deleted from Cloudinary')
        } catch (error) {
          console.error('❌ Failed to delete video:', error)
        }
      }

      // If lesson has backend ID, delete from backend
      if (lesson.backendId) {
        await lessonService.deleteLesson(lesson.backendId)
      }

      // Remove lesson from UI
      const updatedSections = sections.map(s =>
        s.id === sectionId
          ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) }
          : s
      )
      onInputChange('sections', updatedSections)
    } catch (error) {
      console.error('Failed to delete lesson:', error)
      alert('Failed to delete lesson. Please try again.')
    }
  }



  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-700 font-semibold">Course Curriculum</h3>
          <button
            onClick={handleAddSection}
            disabled={isLoadingSections}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>
        </div>

        {isLoadingSections ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Loading sections...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm">No sections yet. Click "Add Section" to start building your curriculum.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <SectionCard
                key={section.id}
                section={section}
                sectionIndex={sectionIndex}
                allSections={sections}
                onUpdate={handleUpdateSection}
                onUpdateTitle={updateSectionTitle}
                onFinishEditing={finishEditing}
                onDelete={handleDeleteSection}
                onAddLesson={handleAddLesson}
                onUpdateLesson={updateLesson}
                onSubmitLesson={submitLesson}
                onEditLesson={editLesson}
                onDeleteLesson={deleteLesson}
                isSavingSection={isSavingSection}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Curriculum