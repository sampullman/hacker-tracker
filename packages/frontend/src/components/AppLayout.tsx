import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'

const AppLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export default AppLayout