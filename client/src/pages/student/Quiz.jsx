import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Quiz = () => {
  const { id } = useParams()
  const { backendUrl, getToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchQuiz()
  }, [id])

  useEffect(() => {
    if (quiz?.isTimed && timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, submitted])

  const fetchQuiz = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`${backendUrl}/api/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setQuiz(data.quiz)
        if (data.quiz.isTimed) {
          setTimeLeft(data.quiz.timeLimit * 60)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer })
  }

  const handleSubmit = async () => {
    try {
      const token = await getToken()
      const answerArray = quiz.questions.map((_, idx) => answers[idx] || '')

      const { data } = await axios.post(`${backendUrl}/api/quiz/${id}/submit`, {
        answers: answerArray,
        timeTaken: quiz.isTimed ? (quiz.timeLimit * 60 - timeLeft) : 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setResult(data)
        setSubmitted(true)
        toast.success('Quiz submitted successfully!')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!quiz) return <div className="flex justify-center items-center h-screen">Loading...</div>

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Quiz Results</h1>
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
              {result.score}%
            </div>
            <p className="text-xl mb-2">{result.passed ? 'Congratulations! You passed!' : 'You did not pass this time.'}</p>
            <p className="text-gray-600">Score: {result.earnedPoints} / {result.totalPoints} points</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Back to Course
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{quiz.quizTitle}</h1>
          {quiz.isTimed && timeLeft !== null && (
            <div className="text-xl font-semibold text-red-600">
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-8">{quiz.quizDescription}</p>

        {quiz.questions.map((question, idx) => (
          <div key={idx} className="mb-8 p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Question {idx + 1}: {question.questionText}</h3>

            {question.questionType === 'multiple-choice' && (
              <div className="space-y-2">
                {question.options?.map((option, optIdx) => (
                  <label key={optIdx} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={option}
                      checked={answers[idx] === option}
                      onChange={() => handleAnswerChange(idx, option)}
                      className="mr-3"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {question.questionType === 'true-false' && (
              <div className="space-y-2">
                {['True', 'False'].map(option => (
                  <label key={option} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={option}
                      checked={answers[idx] === option}
                      onChange={() => handleAnswerChange(idx, option)}
                      className="mr-3"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {question.questionType === 'short-answer' && (
              <input
                type="text"
                value={answers[idx] || ''}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                className="w-full p-3 border rounded"
                placeholder="Your answer"
              />
            )}
          </div>
        ))}

        <button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  )
}

export default Quiz
