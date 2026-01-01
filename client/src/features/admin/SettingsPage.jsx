import { useState } from 'react'

// Payment Gateway Component
const PaymentGateway = ({ name, description, icon, bgColor, defaultActive }) => {
  const [isActive, setIsActive] = useState(defaultActive)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            isActive ? 'text-green-700 bg-green-100' : 'text-gray-600 bg-gray-100'
          }`}>
            {isActive ? 'Active' : 'Disabled'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
          </label>
        </div>
      </div>
      {isActive && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <input 
            type="text" 
            placeholder={`${name} Partner Code`} 
            className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all" 
          />
          <input 
            type="text" 
            placeholder="Access Key" 
            className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all" 
          />
        </div>
      )}
    </div>
  )
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('platform')
  const [showPassword, setShowPassword] = useState(false)

  const tabs = [
    { id: 'platform', name: 'Platform', icon: '🌐' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and platform configuration</p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
          <div className="flex justify-center items-center space-x-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 text-sm font-semibold whitespace-nowrap rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/50 scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="font-bold">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {/* Platform Tab */}
          {activeTab === 'platform' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Platform Configuration</h2>
                <p className="text-sm text-gray-600">Manage your platform&apos;s basic information and branding</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="LearnOw"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Tagline</label>
                    <input
                      type="text"
                      defaultValue="Learn Anything, Anywhere"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea
                    rows={3}
                    defaultValue="Online learning platform for everyone"
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Support Email</label>
                    <input
                      type="email"
                      defaultValue="support@learnow.com"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      defaultValue="+84 900 000 000"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Business Address</label>
                  <input
                    type="text"
                    defaultValue="123 Tech Street, Ho Chi Minh City, Vietnam"
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button className="px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 shadow-lg hover:shadow-xl transition-all flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Gateways</h2>
                <p className="text-sm text-gray-600">Enable and configure payment methods for your platform</p>
              </div>

              <div className="space-y-4 mb-8">
                <PaymentGateway
                  name="MoMo Wallet"
                  description="Mobile payment gateway"
                  icon="📱"
                  bgColor="bg-pink-100"
                  defaultActive={true}
                />
                <PaymentGateway
                  name="ZaloPay"
                  description="Digital wallet payment"
                  icon="💵"
                  bgColor="bg-blue-100"
                  defaultActive={true}
                />
                <PaymentGateway
                  name="VNPay"
                  description="Bank card payment gateway"
                  icon="💳"
                  bgColor="bg-orange-100"
                  defaultActive={false}
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission & Payout Settings</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Platform Commission (%)</label>
                    <input
                      type="number"
                      defaultValue="15"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Percentage charged on each course sale</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Minimum Payout (₫)</label>
                    <input
                      type="number"
                      defaultValue="500000"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Minimum amount for instructor payout</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button className="px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 shadow-lg hover:shadow-xl transition-all flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Change Password</h2>
                  <p className="text-sm text-gray-600">Update your password regularly to keep your account secure</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                    <input
                      type="password"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="mt-5 p-5 bg-sky-50 rounded-xl border border-sky-200">
                  <p className="text-sm font-semibold text-sky-900 mb-2">Password Requirements:</p>
                  <ul className="text-sm text-sky-700 space-y-1">
                    <li className="flex items-center"><span className="mr-2">✓</span> At least 8 characters long</li>
                    <li className="flex items-center"><span className="mr-2">✓</span> Contains uppercase and lowercase letters</li>
                    <li className="flex items-center"><span className="mr-2">✓</span> Contains at least one number</li>
                    <li className="flex items-center"><span className="mr-2">✓</span> Contains at least one special character</li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                  <button className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                    Cancel
                  </button>
                  <button className="px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 shadow-lg hover:shadow-xl transition-all flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Enable Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Use an authenticator app for login verification</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                  </label>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Active Sessions</h2>
                  <p className="text-sm text-gray-600">Manage your active login sessions across devices</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">Chrome on Windows</h3>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Current</span>
                      </div>
                      <p className="text-sm text-gray-500">Ho Chi Minh City, Vietnam • Active now</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Safari on MacBook</h3>
                      <p className="text-sm text-gray-500">Hanoi, Vietnam • 2 hours ago</p>
                    </div>
                    <button className="text-sm font-semibold text-red-600 hover:text-red-700 px-4 py-2 hover:bg-red-50 rounded-lg transition-all">Revoke</button>
                  </div>
                </div>

                <button className="w-full py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                  Sign Out All Other Sessions
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Email Notifications</h2>
                  <p className="text-sm text-gray-600">Choose what email notifications you want to receive</p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'New User Registration', desc: 'Get notified when a new user signs up', checked: true },
                    { title: 'New Course Submission', desc: 'Alert when instructors submit courses for approval', checked: true },
                    { title: 'New Reviews', desc: 'Notification for new course reviews', checked: true },
                    { title: 'New Payment', desc: 'Alert for successful payment transactions', checked: true },
                    { title: 'System Alerts', desc: 'Important system updates and security alerts', checked: false }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Reports</h2>
                  <p className="text-sm text-gray-600">Receive regular reports about platform activity</p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Weekly Report', desc: 'Summary of platform activity every week', checked: true },
                    { title: 'Monthly Report', desc: 'Detailed monthly analytics and insights', checked: false }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage