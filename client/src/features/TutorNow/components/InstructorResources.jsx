const InstructorResources = ({ onOpen }) => {
  // Data for the 4 resource cards
  const resources = [
    {
      key: "tips",
      title: "Course Creation Tips",
      desc: "Learn best practices for creating engaging and effective online courses",
      cta: "Read Guidelines",
      href: "#",
      color: "sky",
      icon: "book",
    },
    {
      key: "performance",
      title: "Track Your Performance",
      desc: "View analytics, student feedback, and revenue for all your courses",
      cta: "View Dashboard",
      href: "#",
      color: "emerald",
      icon: "chart",
    },
    {
      key: "video",
      title: "Video Recording Guide",
      desc: "Essential tips for recording high-quality video lessons at home",
      cta: "Learn More",
      href: "#",
      color: "violet",
      icon: "camera",
    },
    {
      key: "community",
      title: "Instructor Community",
      desc: "Connect with other instructors, share experiences, and get support",
      cta: "Join Community",
      href: "#",
      color: "orange",
      icon: "users",
    },
  ];

  // Color mapping for icon text
  const colorText = {
    sky: "text-sky-500",
    emerald: "text-emerald-500",
    violet: "text-violet-500",
    orange: "text-orange-500",
  };

  // Icon components
  const icons = {
    book: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14h-9.5A2.5 2.5 0 0 0 8 20M8 20H6.5A2.5 2.5 0 0 1 4 17.5V6.5" />
        <path d="M8 4v16" />
      </svg>
    ),
    chart: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 19h16M7 16V9M12 19V5M17 19v-7" />
      </svg>
    ),
    camera: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 8a2 2 0 0 1 2-2h3l2-2h4l2 2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
    users: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="9" cy="10" r="3" />
        <path d="M2 20a7 7 0 0 1 14 0" />
      </svg>
    ),
  };

  return (
    <section className="mt-10 md:mt-12">
      <h2 className="text-3xl font-semibold text-gray-900 text-center">
        Instructor Resources
      </h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.key}
            className="rounded-3xl border border-gray-200 bg-white p-6 md:p-7 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start gap-5">
              {/* Icon container */}
              <div
                className={`shrink-0 w-16 h-16 flex items-center justify-center ${
                  colorText[resource.color]
                }`}
              >
                {icons[resource.icon]}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {resource.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                  {resource.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstructorResources;
