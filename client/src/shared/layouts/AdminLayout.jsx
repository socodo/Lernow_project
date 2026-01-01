import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../features/admin/components/AdminSidebar'
import AdminHeader from '../../features/admin/components/AdminHeader'
import { AdminProvider } from '../../features/admin/AdminContext'

const AdminLayout = () => {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="ml-64">
          <AdminHeader />
          <main className="pt-20 px-8 pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProvider>
  )
}

export default AdminLayout
