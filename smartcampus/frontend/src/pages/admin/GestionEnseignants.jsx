import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function GestionEnseignants() {
  const [teachers, setTeachers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/teachers')
      .then(setTeachers)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1 className="page-title">Gestion des enseignants</h1>
      <p className="subtitle">Liste des enseignants et de leurs cours.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Matière</th>
              <th>Nombre de cours</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id_teacher}>
                <td>{teacher.nom} {teacher.prenom}</td>
                <td>{teacher.email}</td>
                <td>{teacher.matiere}</td>
                <td>{teacher.courseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GestionEnseignants
