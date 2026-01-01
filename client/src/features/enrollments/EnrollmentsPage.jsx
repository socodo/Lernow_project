import EnrollmentsHeader from './components/EnrollmentsHeader'
import SummaryCards from './components/SummaryCards'
import EnrollmentList from './components/EnrollmentList'

// Trang chính cho My Enrollments
const EnrollmentsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EnrollmentsHeader />

        <div className="mt-6 space-y-6">
          <SummaryCards />
          <EnrollmentList />
        </div>
      </div>
    </div>
  )
}

export default EnrollmentsPage
