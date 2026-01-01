import { UsersIcon, StarIcon, BookOpenIcon } from "@heroicons/react/24/outline";

// StatsCards: show key metrics for instructor: total courses, students, rating
const StatsCards = ({ statistics }) => {
  if (!statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Total Courses</div>
            <div className="text-2xl font-bold mt-2">{statistics.totalCourses}</div>
            <div className="text-xs text-gray-400 mt-1">{statistics.publishedCourses} published</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <BookOpenIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Total Students</div>
            <div className="text-2xl font-bold mt-2">{statistics.totalStudents.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <UsersIcon className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Average Rating</div>
            <div className="text-2xl font-bold mt-2">{statistics.averageRating.toFixed(1)}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-full">
            <StarIcon className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
