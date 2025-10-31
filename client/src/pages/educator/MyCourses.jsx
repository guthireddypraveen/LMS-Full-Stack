import React from 'react'
import { useNavigate } from 'react-router-dom'

const MyCourses = () => {
  const navigate = useNavigate()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <p>View and manage your courses from the Dashboard</p>
      <button onClick={() => navigate('/educator/dashboard')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Go to Dashboard
      </button>
    </div>
  )
}

export default MyCourses
