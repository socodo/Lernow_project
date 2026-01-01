// CoursesFilterBar: search input, status and sort dropdowns
const CoursesFilterBar = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value })
  }

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sort: e.target.value })
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex gap-4 items-center">
        <input 
          className="flex-1 p-3 border rounded bg-gray-50" 
          placeholder="Search courses by title or category..." 
          value={filters.search}
          onChange={handleSearchChange}
        />
        <select 
          className="p-3 border rounded bg-white"
          value={filters.status}
          onChange={handleStatusChange}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select 
          className="p-3 border rounded bg-white"
          value={filters.sort}
          onChange={handleSortChange}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  )
}

export default CoursesFilterBar
