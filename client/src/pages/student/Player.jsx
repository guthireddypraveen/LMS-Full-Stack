import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import YouTube from 'react-youtube'
import { toast } from 'react-toastify'

const Player = () => {
  const { id } = useParams()
  const { backendUrl, getToken } = useContext(AppContext)
  const [course, setCourse] = useState(null)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [currentLecture, setCurrentLecture] = useState(0)
  const [enrollment, setEnrollment] = useState(null)

  useEffect(() => {
    fetchCourseAndProgress()
  }, [id])

  const fetchCourseAndProgress = async () => {
    try {
      const token = await getToken()
      const [courseRes, progressRes] = await Promise.all([
        axios.get(`${backendUrl}/api/course/${id}`),
        axios.get(`${backendUrl}/api/enrollment/course/${id}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (courseRes.data.success) {
        setCourse(courseRes.data.course)
      }
      if (progressRes.data.success) {
        setEnrollment(progressRes.data.progress)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const markComplete = async () => {
    try {
      const token = await getToken()
      const chapter = course.courseContent[currentChapter]
      const lecture = chapter.chapterContent[currentLecture]

      await axios.put(`${backendUrl}/api/enrollment/${enrollment._id}/progress`, {
        chapterId: chapter._id,
        lectureId: lecture._id,
        completed: true
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Lecture marked as complete')
      fetchCourseAndProgress()
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!course) return <div>Loading...</div>

  const currentChapterData = course.courseContent[currentChapter]
  const currentLectureData = currentChapterData?.chapterContent[currentLecture]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-gray-100 overflow-y-auto">
        <div className="p-4">
          <h2 className="font-bold text-xl mb-4">Course Content</h2>
          {course.courseContent.map((chapter, chIdx) => (
            <div key={chIdx} className="mb-4">
              <h3 className="font-semibold mb-2">{chapter.chapterTitle}</h3>
              {chapter.chapterContent.map((lecture, lecIdx) => (
                <button
                  key={lecIdx}
                  onClick={() => { setCurrentChapter(chIdx); setCurrentLecture(lecIdx); }}
                  className={`w-full text-left p-2 rounded mb-1 ${
                    chIdx === currentChapter && lecIdx === currentLecture
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {lecture.lectureTitle}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{currentLectureData?.lectureTitle}</h1>

          {/* Video Player */}
          {currentLectureData?.lectureType === 'video' && (
            <div className="mb-6">
              {currentLectureData.lectureContent.includes('youtube.com') ? (
                <YouTube videoId={new URL(currentLectureData.lectureContent).searchParams.get('v')} 
                  opts={{ width: '100%', height: '500' }} />
              ) : (
                <video src={currentLectureData.lectureContent} controls className="w-full rounded-lg" />
              )}
            </div>
          )}

          {/* Text Content */}
          {currentLectureData?.lectureType === 'text' && (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLectureData.lectureContent }} />
          )}

          {/* Document */}
          {currentLectureData?.lectureType === 'document' && (
            <div>
              <a href={currentLectureData.lectureContent} target="_blank" rel="noopener noreferrer" 
                className="bg-blue-600 text-white px-4 py-2 rounded">
                Download Document
              </a>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button onClick={markComplete} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Mark as Complete
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between mb-2">
              <span>Progress</span>
              <span>{enrollment?.completionPercentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${enrollment?.completionPercentage || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player
