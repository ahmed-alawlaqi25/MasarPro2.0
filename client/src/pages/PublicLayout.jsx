import React from 'react'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <div>
        <h1>PublicLayout</h1>
        <div><Outlet /></div>
    </div>

  )
}

export default PublicLayout