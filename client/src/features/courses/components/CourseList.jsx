import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { DEFAULT_COURSE_THUMBNAIL } from "../../../utils/constants"

// CourseList: list of instructor-created courses with summary cards
const CourseList = ({ courses = [], setCourses, onDeleteCourse }) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    // Remove course from state
    // Note: In real app, this should call API
    if (onDeleteCourse) {
      onDeleteCourse(courseToDelete._id);
    } else if (setCourses) {
        setCourses(courses.filter((c) => c._id !== courseToDelete._id));
    }
    setDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">No courses found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {courses.map((c) => (
        <div
          key={c._id}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex gap-6"
        >
          <div className="w-56 h-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
            <img
              src={c.thumbnailUrl || DEFAULT_COURSE_THUMBNAIL}
              alt={c.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <div className="ml-auto">
                <span className="inline-block text-xs bg-gray-900 text-white px-3 py-1 rounded">
                  {c.state || "DRAFT"}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => toggleMenu(c._id, e)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <EllipsisVerticalIcon className="w-6 h-6" />
                </button>

                {openMenuId === c._id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100 py-1 ring-1 ring-black ring-opacity-5"
                  >
                    <button
                      onClick={() =>
                        navigate(`/instructor/courses/${c._id}/edit`)
                      }
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <PencilSquareIcon className="w-4 h-4" /> Edit Course
                    </button>
                    <button
                      onClick={() => handleDeleteClick(c)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-500 flex gap-4 items-center">
              <span>{c.totalLessons || 0} lessons</span>
              <span></span>
              <span>{c.totalDuration || "0h 0m"}</span>
              <span></span>
              <span>{c.tags?.join(", ") || "No tags"}</span>
              <span></span>
              <span className="border border-gray-200 px-2 py-1 rounded text-xs uppercase font-medium">
                {c.level}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                Students
                <br />
                <div className="text-xl font-bold">{c.totalEnrollments || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500 mb-1">Rating</div>
                <div className="text-xl font-bold">
                  {c.averageRating ? c.averageRating.toFixed(1) : "No ratings"}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-400">
              Created: {new Date(c.createdAt).toLocaleDateString()} <span className="mx-2"></span> Updated: {new Date(c.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Delete Course
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-bold">
                          {courseToDelete?.title}
                        </span>
                        ? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
