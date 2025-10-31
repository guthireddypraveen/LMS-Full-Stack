import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0
  })
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`${backendUrl}/api/course/instructor/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setCourses(data.courses)
        setStats({
          totalCourses: data.courses.length,
          totalStudents: data.courses.reduce((sum, c) => sum + c.totalEnrollments, 0),
          totalRevenue: data.courses.reduce((sum, c) => sum + (c.coursePrice * c.totalEnrollments), 0)
        })
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Educator Dashboard</h1>
          <button 
            onClick={() => navigate('/educator/add-course')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create New Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Courses</h3>
            <p className="text-3xl font-bold">{stats.totalCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Students</h3>
            <p className="text-3xl font-bold">{stats.totalStudents}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">${stats.totalRevenue}</p>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Your Courses</h2>
          </div>
          <div className="divide-y">
            {courses.map(course => (
              <div key={course._id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <img src={course.courseThumbnail || '/placeholder.jpg'} alt={course.courseTitle} className="w-20 h-20 rounded object-cover" />
                  <div>
                    <h3 className="font-bold text-lg">{course.courseTitle}</h3>
                    <p className="text-gray-600">{course.totalEnrollments} students enrolled</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => navigate(`/educator/students/${course._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
