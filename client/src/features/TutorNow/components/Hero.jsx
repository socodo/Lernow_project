const Hero = ({ onCreate }) => {
  return (
    <section aria-labelledby="hero-heading" className="relative bg-gradient-to-br from-[#38BDF8] to-[#2563EB] text-center py-16 md:py-20 px-6 md:px-8">
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/5 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Book Icon */}
        <div className="bg-white/15 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-3">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <h2 id="hero-heading" className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
          Share Your Knowledge with the World
        </h2>
        <p className="text-[15px] text-white/90 mb-4 max-w-2xl mx-auto">
          Create engaging online courses and inspire learners globally.<br />
          Turn your expertise into impact and income.
        </p>
        <div className="mt-4">
          <button
            onClick={() => onCreate({
              id: `course_${Date.now()}`,
              title: 'Untitled Course',
              createdAt: new Date()
            })}
            aria-label="Create a new course and start teaching"
            className="bg-white text-sky-600 font-medium px-5 py-3 rounded-full hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 transition-all duration-300 transform hover:scale-[1.02] w-full md:w-auto inline-flex items-center justify-center gap-2"
          >
            <div className="bg-sky-600/10 rounded p-1">
              <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            Create New Course
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero