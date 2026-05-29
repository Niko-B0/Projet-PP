import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function TableauDeBordAdmin() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/dashboard/admin')
      .then(setDashboard)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1 className="page-title">Dashboard administrateur</h1>
      <p className="subtitle">Vue globale du campus et des statistiques.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="grid grid-3">
        <div className="card"><strong>Étudiants</strong><p>{dashboard?.studentsCount ?? '...'}</p></div>
        <div className="card"><strong>Enseignants</strong><p>{dashboard?.teachersCount ?? '...'}</p></div>
        <div className="card"><strong>Cours actifs</strong><p>{dashboard?.activeCourses ?? '...'}</p></div>
        <div className="card"><strong>Semestre courant</strong><p>{dashboard?.currentSemester ?? '...'}</p></div>
      </div>
    </div>
  )
}

export default TableauDeBordAdmin
