import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/student/Footer'

const MyEnrollments = () => {
  const { enrolledCourses, fetchUserEnrolledCourses } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserEnrolledCourses()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Enrollments</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(enrollment => (
            <div key={enrollment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={enrollment.courseId?.courseThumbnail || '/placeholder.jpg'} 
                alt={enrollment.courseId?.courseTitle} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{enrollment.courseId?.courseTitle}</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-semibold">{enrollment.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${enrollment.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                {enrollment.isCompleted && enrollment.certificateIssued && (
                  <button 
                    onClick={() => navigate(`/certificate/${enrollment.certificateId}`)}
                    className="w-full mb-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    View Certificate
                  </button>
                )}
                <button 
                  onClick={() => navigate(`/player/${enrollment.courseId._id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>

        {enrolledCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">You haven't enrolled in any courses yet</p>
            <button 
              onClick={() => navigate('/courses')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MyEnrollments
