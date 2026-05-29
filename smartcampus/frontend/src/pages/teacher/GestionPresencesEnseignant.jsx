import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function GestionPresencesEnseignant({ user }) {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.get(`/teachers/${user.id_teacher}/courses`)
      .then(setCourses)
      .catch((err) => setError(err.message))
  }, [user.id_teacher])

  useEffect(() => {
    if (!selectedCourse) return
    api.get(`/courses/${selectedCourse}/students`)
      .then(setStudents)
      .catch((err) => setError(err.message))
  }, [selectedCourse])

  const handleAttendance = async (enrollmentId, statut) => {
    setError(null)
    setMessage(null)
    try {
      await api.post('/attendance', { id_enrollment: enrollmentId, statut })
      setMessage('Présence mise à jour')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">Gestion des présences</h1>
      <p className="subtitle">Sélectionnez un cours puis marquez les présences.</p>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="error-message" style={{ color: '#d9f99d' }}>{message}</div>}
      <label>
        Choisir un cours
        <select value={selectedCourse || ''} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">-- Choisir --</option>
          {courses.map((course) => (
            <option key={course.id_course} value={course.id_course}>{course.nom_cours}</option>
          ))}
        </select>
      </label>
      {selectedCourse && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Présent</th>
                <th>Absent</th>
                <th>Justifié</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.enrollment_id}>
                  <td>{student.nom} {student.prenom}</td>
                  <td><button className="secondary" onClick={() => handleAttendance(student.enrollment_id, 'present')}>Présent</button></td>
                  <td><button className="secondary" onClick={() => handleAttendance(student.enrollment_id, 'absent')}>Absent</button></td>
                  <td><button className="secondary" onClick={() => handleAttendance(student.enrollment_id, 'justifie')}>Justifié</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default GestionPresencesEnseignant
