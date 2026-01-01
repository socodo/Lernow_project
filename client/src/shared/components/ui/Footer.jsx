const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Middle Section - Navigation Links */}
        <div className="flex justify-center mb-6">
          <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 text-sm">
            <li><a href="#" className="text-gray-300 hover:text-sky-400 transition-colors py-2 px-4 sm:px-0 text-center">About Us</a></li>
            <li><a href="#" className="text-gray-300 hover:text-sky-400 transition-colors py-2 px-4 sm:px-0 text-center">Terms</a></li>
            <li><a href="#" className="text-gray-300 hover:text-sky-400 transition-colors py-2 px-4 sm:px-0 text-center">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-300 hover:text-sky-400 transition-colors py-2 px-4 sm:px-0 text-center">Support</a></li>
          </ul>
        </div>


        {/* Top Section - Contact Icons */}
        <div className="flex justify-center space-x-16 mb-6">
          {/* Facebook */}
          <a href="#" className="text-gray-300 hover:text-sky-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Email */}
          <a href="mailto:contact@learnow.com" className="text-gray-300 hover:text-sky-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>

          {/* Phone */}
          <a href="tel:+1234567890" className="text-gray-300 hover:text-sky-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </a>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="text-center border-t border-gray-700 pt-6">
          <p className="text-gray-100 text-opacity-50 text-sm">
            © 2025 Learnow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer