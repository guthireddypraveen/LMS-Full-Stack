import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Rating from '../../components/student/Rating'
import { useUser } from '@clerk/clerk-react'
import Footer from '../../components/student/Footer'

const CourseDetails = () => {
  const { id } = useParams()
  const { backendUrl, currency, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext)
  const { user } = useUser()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    fetchCourseDetails()
    if (user) {
      checkEnrollment()
    }
  }, [id, user])

  const fetchCourseDetails = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`)
      if (data.success) {
        setCourse(data.course)
      }
      setLoading(false)
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`${backendUrl}/api/enrollment/course/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setEnrolled(true)
      }
    } catch (error) {
      setEnrolled(false)
    }
  }

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please login to enroll')
      return
    }
    navigate(`/checkout/${id}`)
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{course.courseTitle}</h1>
              <p className="text-lg mb-4">{course.courseDescription}</p>
              <div className="flex items-center gap-4 mb-4">
                <Rating rating={course.courseRatings?.length > 0 ? Math.floor(course.courseRatings.reduce((acc, r) => acc + r.rating, 0) / course.courseRatings.length) : 0} />
                <span>({course.courseRatings?.length || 0} ratings)</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>{course.totalEnrollments || 0} students</span>
                <span>•</span>
                <span>{calculateNoOfLectures(course)} lectures</span>
                <span>•</span>
                <span>{calculateCourseDuration(course)}</span>
              </div>
              <p className="mt-4">Created by {course.instructorName}</p>
            </div>
            <div className="bg-white text-gray-900 p-6 rounded-lg">
              <img src={course.courseThumbnail || '/course-placeholder.jpg'} alt={course.courseTitle} className="w-full rounded-lg mb-4" />
              <div className="text-3xl font-bold mb-4">{currency}{course.coursePrice}</div>
              {enrolled ? (
                <button onClick={() => navigate(`/player/${id}`)} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                  Go to Course
                </button>
              ) : (
                <button onClick={handleEnroll} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button onClick={() => setActiveTab('overview')} className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab('curriculum')} className={`pb-2 px-4 ${activeTab === 'curriculum' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}>
            Curriculum
          </button>
          <button onClick={() => setActiveTab('instructor')} className={`pb-2 px-4 ${activeTab === 'instructor' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}>
            Instructor
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`pb-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}>
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">About this course</h2>
            <p>{course.courseDescription}</p>
            <div className="mt-6">
              <h3 className="font-bold mb-2">What you'll learn</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Comprehensive understanding of {course.courseTitle}</li>
                <li>Practical skills and hands-on experience</li>
                <li>Certificate upon completion</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
            {course.courseContent?.map((chapter, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4">
                <h3 className="font-bold text-lg mb-2">{chapter.chapterTitle}</h3>
                <p className="text-gray-600 mb-2">{chapter.chapterDescription}</p>
                <ul className="space-y-2">
                  {chapter.chapterContent?.map((lecture, lidx) => (
                    <li key={lidx} className="flex justify-between items-center py-2 border-b">
                      <span>{lecture.lectureTitle}</span>
                      <span className="text-sm text-gray-500">{lecture.lectureDuration} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">About the Instructor</h2>
            <div className="flex items-center gap-4 mb-4">
              <img src={course.instructorImage || '/avatar-placeholder.jpg'} alt={course.instructorName} className="w-20 h-20 rounded-full" />
              <div>
                <h3 className="font-bold text-xl">{course.instructorName}</h3>
                <p className="text-gray-600">{course.instructorBio}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
            {course.courseRatings?.map((review, idx) => (
              <div key={idx} className="border-b py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Rating rating={review.rating} />
                </div>
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CourseDetails
