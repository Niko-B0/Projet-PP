import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function MesNotesEtudiant({ user }) {
  const [grades, setGrades] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/students/${user.id_student}/grades`)
      .then(setGrades)
      .catch((err) => setError(err.message))
  }, [user.id_student])

  return (
    <div>
      <h1 className="page-title">Mes notes</h1>
      <p className="subtitle">Visualisez vos résultats par cours et moyenne.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cours</th>
              <th>Note</th>
              <th>Coefficient</th>
              <th>Évaluation</th>
              <th>Moyenne du cours</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((item) => (
              <tr key={item.id_grade}>
                <td>{item.nom_cours}</td>
                <td>{item.valeur ?? '-'}</td>
                <td>{item.coef}</td>
                <td>{item.type_evaluation}</td>
                <td>{item.course_average ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MesNotesEtudiant
