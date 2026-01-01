import herosection from '../../../assets/herosection.png'

const HeroSection = () => {
  return (
    <div
      className="relative h-96 rounded-lg overflow-hidden bg-cover bg-center bg-no-repeat max-w-7xl mx-auto mt-10"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${herosection})`
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-white text-5xl font-black mb-4 max-w-4xl drop-shadow-lg">
          Learn Anytime, Anywhere
        </h1>
        <p className="text-white text-lg font-normal max-w-2xl drop-shadow-md">
          Explore top courses and start your journey today
        </p>
      </div>
    </div>
  )
}

export default HeroSection