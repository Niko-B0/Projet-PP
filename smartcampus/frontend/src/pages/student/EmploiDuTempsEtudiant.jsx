import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function EmploiDuTempsEtudiant({ user }) {
  const [schedule, setSchedule] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/students/${user.id_student}/schedule`)
      .then(setSchedule)
      .catch((err) => setError(err.message))
  }, [user.id_student])

  return (
    <div>
      <h1 className="page-title">Emploi du temps</h1>
      <p className="subtitle">Planning des cours auxquels vous êtes inscrit.</p>
      {error && <div className="error-message">{error}</div>}
      {schedule.map((item) => (
        <div key={item.id_slot} className="card" style={{ marginBottom: 12 }}>
          <strong>{item.nom_cours}</strong>
          <p>{item.jour} • {item.heure_debut} - {item.heure_fin}</p>
          <p>Salle {item.salle} • {item.teacher_name}</p>
        </div>
      ))}
      {schedule.length === 0 && <div className="card">Aucun cours planifié actuellement.</div>}
    </div>
  )
}

export default EmploiDuTempsEtudiant
