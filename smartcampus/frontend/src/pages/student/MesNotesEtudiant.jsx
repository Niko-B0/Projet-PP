import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api.js'

function formatNumber(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  const number = Number(value)
  return Number.isNaN(number) ? '-' : number.toFixed(2).replace('.00', '')
}

function MesNotesEtudiant({ user }) {
  const [grades, setGrades] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    api.get(`/students/${user.id_student}/grades`)
      .then(setGrades)
      .catch((err) => setError(err.message))
  }, [user.id_student])

  const gradedRows = grades.filter((item) => item.valeur !== null && item.valeur !== undefined)
  const generalAverage = useMemo(() => {
    if (gradedRows.length === 0) {
      return null
    }
    const total = gradedRows.reduce((sum, item) => sum + Number(item.valeur) * Number(item.coef || 1), 0)
    const coefTotal = gradedRows.reduce((sum, item) => sum + Number(item.coef || 1), 0)
    return coefTotal > 0 ? total / coefTotal : null
  }, [gradedRows])

  return (
    <div>
      <h1 className="page-title">Mes notes</h1>
      <p className="subtitle">Visualisez vos resultats par cours et votre moyenne.</p>
      {error && <div className="error-message">{error}</div>}
      {!error && grades.length === 0 && (
        <div className="panel">
          <p>Aucun cours note pour le moment.</p>
        </div>
      )}
      {!error && grades.length > 0 && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <strong>Moyenne generale</strong>
            <p>{generalAverage === null ? 'En attente de notes' : `${formatNumber(generalAverage)} / 20`}</p>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Cours</th>
                  <th>Note</th>
                  <th>Coefficient</th>
                  <th>Evaluation</th>
                  <th>Moyenne du cours</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((item) => (
                  <tr key={`${item.id_grade}-${item.nom_cours}-${item.type_evaluation || 'pending'}`}>
                    <td>{item.nom_cours}</td>
                    <td>{item.valeur === null || item.valeur === undefined ? 'En attente' : `${formatNumber(item.valeur)} / 20`}</td>
                    <td>{formatNumber(item.coef)}</td>
                    <td>{item.type_evaluation || '-'}</td>
                    <td>{item.course_average === null || item.course_average === undefined ? 'En attente' : `${formatNumber(item.course_average)} / 20`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default MesNotesEtudiant
