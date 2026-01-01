const Benefits = ({ items }) => {
  const colorMap = {
    blue: "bg-sky-400",
    green: "bg-emerald-500",
    purple: "bg-violet-500"
  }

  const renderIcon = (icon) => {
    switch (icon) {
      case 'globe':
        return (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        )
      case 'book':
        return (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
          </svg>
        )
      case 'shield':
        return (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17 15.4,17.5 14.8,17.5H9.2C8.6,17.5 8,17 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section aria-labelledby="benefits-heading">
      <h2 id="benefits-heading" className="text-3xl font-semibold tracking-tight text-gray-900 text-center mb-8">
        Why Teach on LearnOw?
      </h2>

      {/* Top divider */}
      <div className="h-px bg-gray-200 mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start justify-items-center">
        {items.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`w-16 h-16 ${colorMap[item.color]} rounded-full mx-auto flex items-center justify-center overflow-hidden`} role="img" aria-hidden="true">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                renderIcon(item.icon)
              )}
            </div>
            <h3 className="text-[19px] font-semibold tracking-tight text-gray-900 mt-3">
              {item.title}
            </h3>
            <p className="text-[15px] text-gray-600 leading-relaxed max-w-xs mx-auto">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom divider */}
      <div className="h-px bg-gray-200 mt-8"></div>
    </section>
  )
}

export default Benefits