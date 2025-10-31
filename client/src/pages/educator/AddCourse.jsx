import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    courseCategory: 'Web Development',
    courseLevel: 'Beginner',
    coursePrice: 0,
    instructorBio: ''
  })
  const [thumbnail, setThumbnail] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, courseDescription: value })
  }

  const addChapter = () => {
    setChapters([...chapters, {
      chapterTitle: '',
      chapterDescription: '',
      chapterOrder: chapters.length + 1,
      lectures: []
    }])
  }

  const handleChapterChange = (idx, field, value) => {
    const updated = [...chapters]
    updated[idx][field] = value
    setChapters(updated)
  }

  const addLecture = (chapterIdx) => {
    const updated = [...chapters]
    updated[chapterIdx].lectures.push({
      lectureTitle: '',
      lectureType: 'video',
      lectureContent: '',
      lectureDuration: 0,
      lectureOrder: updated[chapterIdx].lectures.length + 1
    })
    setChapters(updated)
  }

  const handleLectureChange = (chapterIdx, lectureIdx, field, value) => {
    const updated = [...chapters]
    updated[chapterIdx].lectures[lectureIdx][field] = value
    setChapters(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = await getToken()
      const formDataToSend = new FormData()

      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })

      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail)
      }

      const { data } = await axios.post(`${backendUrl}/api/course/create`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        // Add chapters
        for (const chapter of chapters) {
          await axios.post(`${backendUrl}/api/course/${data.course._id}/chapter`, {
            chapterTitle: chapter.chapterTitle,
            chapterDescription: chapter.chapterDescription,
            chapterOrder: chapter.chapterOrder
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        }

        toast.success('Course created successfully!')
        navigate('/educator/my-courses')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Course Title</label>
            <input
              type="text"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Course Description</label>
            <ReactQuill 
              value={formData.courseDescription}
              onChange={handleDescriptionChange}
              className="bg-white"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Category</label>
              <select
                name="courseCategory"
                value={formData.courseCategory}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option>Web Development</option>
                <option>Data Science</option>
                <option>Business</option>
                <option>Design</option>
                <option>Marketing</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">Level</label>
              <select
                name="courseLevel"
                value={formData.courseLevel}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">Price ($)</label>
            <input
              type="number"
              name="coursePrice"
              value={formData.coursePrice}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Course Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Instructor Bio</label>
            <textarea
              name="instructorBio"
              value={formData.instructorBio}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Chapters */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Course Chapters</h2>
              <button type="button" onClick={addChapter} className="bg-green-600 text-white px-4 py-2 rounded">
                Add Chapter
              </button>
            </div>

            {chapters.map((chapter, idx) => (
              <div key={idx} className="border rounded p-4 mb-4">
                <h3 className="font-semibold mb-3">Chapter {idx + 1}</h3>
                <input
                  type="text"
                  placeholder="Chapter Title"
                  value={chapter.chapterTitle}
                  onChange={(e) => handleChapterChange(idx, 'chapterTitle', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder="Chapter Description"
                  value={chapter.chapterDescription}
                  onChange={(e) => handleChapterChange(idx, 'chapterDescription', e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="2"
                />
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCourse
