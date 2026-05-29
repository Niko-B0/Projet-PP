import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function InscriptionCoursEtudiant({ user }) {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/courses')
      .then(setCourses)
      .catch((err) => setError(err.message))
    api.get(`/students/${user.id_student}/courses`)
      .then(setEnrollments)
      .catch(() => {})
  }, [user.id_student])

  const enrolledCourseIds = new Set(enrollments.map((item) => item.id_course))

  const handleSubscribe = async (course) => {
    setError(null)
    setMessage(null)
    try {
      await api.post('/enrollments', { id_student: user.id_student, id_course: course.id_course })
      setMessage(`Inscription réussie pour ${course.nom_cours}`)
      setEnrollments([...enrollments, { ...course, id_course: course.id_course }])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">Inscription aux cours</h1>
      <p className="subtitle">Choisissez un cours disponible pour votre semestre.</p>
      {message && <div className="error-message" style={{ color: '#d9f99d' }}>{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cours</th>
              <th>Enseignant</th>
              <th>Places</th>
              <th>Horaire</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id_course}>
                <td>{course.nom_cours}</td>
                <td>{course.teacher_name}</td>
                <td>{course.capacite - course.enrolled_count}</td>
                <td>{course.schedule || 'N/A'}</td>
                <td>
                  <button
                    className="primary"
                    disabled={enrolledCourseIds.has(course.id_course) || course.capacite <= course.enrolled_count}
                    onClick={() => handleSubscribe(course)}
                  >
                    {enrolledCourseIds.has(course.id_course) ? 'Déjà inscrit' : 'S’inscrire'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InscriptionCoursEtudiant
