import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function MesCoursEtudiant({ user }) {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    api.get(`/students/${user.id_student}/courses`)
      .then(setCourses)
      .catch((err) => setError(err.message))
  }, [user.id_student])

  const handleUnsubscribe = async (enrollmentId) => {
    setStatus(null)
    try {
      await api.delete(`/enrollments/${enrollmentId}`)
      setCourses(courses.filter((item) => item.enrollment_id !== enrollmentId))
      setStatus('Inscription supprimée.')
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">Mes cours</h1>
      <p className="subtitle">Liste des cours auxquels vous êtes inscrit.</p>
      {status && <div className="error-message">{status}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cours</th>
              <th>Enseignant</th>
              <th>Semestre</th>
              <th>Crédits</th>
              <th>Coefficient</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.enrollment_id}>
                <td>{course.nom_cours}</td>
                <td>{course.teacher_name}</td>
                <td>{course.semestre}</td>
                <td>{course.credits}</td>
                <td>{course.coefficient}</td>
                <td>
                  <button className="secondary" onClick={() => handleUnsubscribe(course.enrollment_id)}>
                    Se désinscrire
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

export default MesCoursEtudiant
