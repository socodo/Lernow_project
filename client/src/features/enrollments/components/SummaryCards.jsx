// SummaryCards: 3 cards showing total, in-progress, completed
const SummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Total Enrolled</div>
        <div className="text-2xl font-bold mt-2">2</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">In Progress</div>
        <div className="text-2xl font-bold mt-2">1</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-sm text-gray-500">Completed</div>
        <div className="text-2xl font-bold mt-2">1</div>
      </div>
    </div>
  )
}

export default SummaryCards
