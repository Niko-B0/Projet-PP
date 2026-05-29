import { useEffect, useState } from 'react'
import api from '../../services/api.js'
import Card from '../../components/Card.jsx'

function TableauDeBordEtudiant({ user }) {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/dashboard/student')
      .then(setDashboard)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1 className="page-title">Dashboard étudiant</h1>
      <p className="subtitle">Bienvenue {user?.prenom}, voici un résumé de votre semestre.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="grid grid-3">
        <Card title="Cours suivis">{dashboard?.courseCount ?? '...'}</Card>
        <Card title="Moyenne générale">{dashboard?.average ?? '...'}</Card>
        <Card title="Absences">{dashboard?.absenceCount ?? '...'}</Card>
        <Card title="Crédits">{dashboard?.credits ?? '...'}</Card>
        <Card title="Prochaines séances">{dashboard?.nextSessions ?? '...'}</Card>
      </div>
    </div>
  )
}

export default TableauDeBordEtudiant
