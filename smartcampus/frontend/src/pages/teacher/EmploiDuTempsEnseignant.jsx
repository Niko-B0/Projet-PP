import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function EmploiDuTempsEnseignant({ user }) {
  const [schedule, setSchedule] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/teachers/${user.id_teacher}/schedule`)
      .then(setSchedule)
      .catch((err) => setError(err.message))
  }, [user.id_teacher])

  return (
    <div>
      <h1 className="page-title">Emploi du temps</h1>
      <p className="subtitle">Vos créneaux de cours sont listés ci-dessous.</p>
      {error && <div className="error-message">{error}</div>}
      {schedule.map((item) => (
        <div key={item.id_slot} className="card" style={{ marginBottom: 12 }}>
          <strong>{item.nom_cours}</strong>
          <p>{item.jour} • {item.heure_debut} - {item.heure_fin}</p>
          <p>Salle {item.salle} • Niveau {item.niveau}</p>
        </div>
      ))}
      {schedule.length === 0 && <div className="card">Aucun créneau assigné.</div>}
    </div>
  )
}

export default EmploiDuTempsEnseignant
