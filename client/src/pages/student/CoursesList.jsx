import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import CourseCard from '../../components/student/CourseCard'
import Footer from '../../components/student/Footer'

const CoursesList = () => {
  const { allCourses } = useContext(AppContext)
  const [filteredCourses, setFilteredCourses] = useState([])
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    filterCourses()
  }, [allCourses, category, searchQuery])

  const filterCourses = () => {
    let courses = allCourses

    if (category !== 'all') {
      courses = courses.filter(course => course.courseCategory === category)
    }

    if (searchQuery) {
      courses = courses.filter(course => 
        course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCourses(courses)
  }

  const categories = ['all', 'Web Development', 'Data Science', 'Business', 'Design', 'Marketing']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Courses</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[300px] px-4 py-2 border rounded-lg"
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses found</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default CoursesList
