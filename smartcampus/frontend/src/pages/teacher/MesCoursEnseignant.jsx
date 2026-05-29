import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function MesCoursEnseignant({ user }) {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/teachers/${user.id_teacher}/courses`)
      .then(setCourses)
      .catch((err) => setError(err.message))
  }, [user.id_teacher])

  return (
    <div>
      <h1 className="page-title">Mes cours</h1>
      <p className="subtitle">Liste des cours qui vous sont assignés.</p>
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
                  <button className="secondary">Voir étudiants</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MesCoursEnseignant
