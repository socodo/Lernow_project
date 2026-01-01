import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enrollmentService } from "../../../service/enrollmentService";

// EnrollmentList: list of enrolled courses with progress and actions
const EnrollmentList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setIsLoading(true);
        const data = await enrollmentService.getMyEnrollments();
        // Map API data to component format
        const mappedCourses = data.map(enrollment => ({
          id: enrollment.courseId._id,
          title: enrollment.courseId.title,
          instructor: enrollment.courseId.creatorId?.fullName || "Unknown Instructor",
          progress: enrollment.progress || 0,
          lastWatched: enrollment.updatedAt, // Keep as ISO string for sorting, format for display
          lessons: enrollment.courseId.totalLessons || 0,
          image: enrollment.courseId.thumbnailUrl || "/src/assets/herosection.png",
          status: (enrollment.progress || 0) === 100 ? "completed" : "in-progress",
          description: enrollment.courseId.description || "No description available.",
          enrollmentId: enrollment._id
        }));
        setCourses(mappedCourses);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // parse date helper
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    return new Date(dateStr);
  };

  const visible = useMemo(() => {
    let list = courses.filter((c) =>
      filter === "all"
        ? true
        : filter === "in-progress"
          ? c.status === "in-progress"
          : c.status === "completed"
    );

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.instructor && c.instructor.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const da = parseDate(a.lastWatched);
      const db = parseDate(b.lastWatched);
      if (sort === "newest") return db - da;
      return da - db;
    });

    return list;
  }, [courses, filter, search, sort]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading your courses...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
        <div className="flex gap-4 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 border rounded bg-gray-50"
            placeholder="Search courses by title or instructor..."
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 border rounded bg-white"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-3 border rounded bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {visible.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex gap-6"
          >
            <img src={c.image} className="w-48 h-28 object-cover rounded" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-500">by {c.instructor}</p>
              <p className="mt-3 text-gray-600 line-clamp-2">
                {c.description}
              </p>

              <div className="mt-4">
                <div className="text-sm text-gray-500 mb-1">Progress</div>
                <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                  <div
                    className="h-3 bg-sky-500"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2 flex justify-between">
                  <span>Last watched {new Date(c.lastWatched).toLocaleDateString()}</span>
                  <span>{c.lessons} lessons</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <div
                className={`text-sm px-3 py-1 rounded ${c.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {c.status === "completed" ? "Completed" : "In Progress"}
              </div>
              <button
                onClick={() => navigate(`/learn/${c.id}`)}
                className="mt-4 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition-colors"
              >
                {c.status === "completed" ? "Review" : "Continue Learning"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollmentList;
