const Steps = ({ steps, onCreate }) => {
  return (
    <section aria-labelledby="steps-heading">
      <h2 id="steps-heading" className="text-3xl font-semibold tracking-tight text-gray-900 text-center mb-6">
        How to Get Started
      </h2>

      <div className="mb-8">
        <ul className="space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {step.n}
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-semibold tracking-tight text-gray-900 mb-1">{step.title}</h3>
                <p className="text-[15px] text-gray-600">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>


    </section>
  )
}

export default Steps