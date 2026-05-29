import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function TableauDeBordEnseignant({ user }) {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/dashboard/teacher')
      .then(setDashboard)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1 className="page-title">Dashboard enseignant</h1>
      <p className="subtitle">Bienvenue {user?.prenom}, voici vos informations de service.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="grid grid-3">
        <div className="card"><strong>Cours assignés</strong><p>{dashboard?.courseCount ?? '...'}</p></div>
        <div className="card"><strong>Notes à saisir</strong><p>{dashboard?.gradesToEnter ?? '...'}</p></div>
        <div className="card"><strong>Prochains cours</strong><p>{dashboard?.nextSlots ?? '...'}</p></div>
      </div>
    </div>
  )
}

export default TableauDeBordEnseignant
