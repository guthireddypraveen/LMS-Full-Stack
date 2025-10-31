import React from 'react'
import Hero from '../../components/student/Hero'
import SearchBar from '../../components/student/SearchBar'
import CoursesSection from '../../components/student/CoursesSection'
import Companies from '../../components/student/Companies'
import TestimonialsSection from '../../components/student/TestimonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SearchBar />
      <CoursesSection />
      <Companies />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home
