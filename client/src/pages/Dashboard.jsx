import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../components/AuthContext'

const Dashboard = () => {
  const { session, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Dashboard