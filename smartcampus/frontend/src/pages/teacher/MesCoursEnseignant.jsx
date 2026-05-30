import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function MesCoursEnseignant({ user }) {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/teachers/${user.id_teacher}/courses`)
      .then(setCourses)
      .catch((err) => setError(err.message))
  }, [user.id_teacher])

  const handleShowStudents = async (course) => {
    setError(null)
    setSelectedCourse(course)
    setStudents([])
    setLoadingStudents(true)
    try {
      const data = await api.get(`/courses/${course.id_course}/students`)
      setStudents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingStudents(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Mes cours</h1>
      <p className="subtitle">Liste des cours qui vous sont assignes.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom du cours</th>
              <th>Semestre</th>
              <th>Niveau</th>
              <th>Inscrits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id_course}>
                <td>{course.nom_cours}</td>
                <td>{course.semestre}</td>
                <td>{course.niveau}</td>
                <td>{course.enrolled_count}</td>
                <td>
                  <button className="secondary" type="button" onClick={() => handleShowStudents(course)}>
                    Voir etudiants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCourse && (
        <div className="panel" style={{ marginTop: 20 }}>
          <h2>Etudiants inscrits - {selectedCourse.nom_cours}</h2>
          {loadingStudents ? (
            <p>Chargement...</p>
          ) : students.length === 0 ? (
            <p className="subtitle">Aucun etudiant inscrit a ce cours.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Telephone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id_student}>
                      <td>{student.nom} {student.prenom}</td>
                      <td>{student.email}</td>
                      <td>{student.telephone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MesCoursEnseignant
