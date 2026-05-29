import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function PresencesEtudiant({ user }) {
  const [attendance, setAttendance] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/students/${user.id_student}/attendance`)
      .then(setAttendance)
      .catch((err) => setError(err.message))
  }, [user.id_student])

  const presentCount = attendance.filter((item) => item.statut === 'present').length
  const rate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0

  return (
    <div>
      <h1 className="page-title">Présences</h1>
      <p className="subtitle">Suivi de vos séances et taux de présence.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card"><strong>Taux de présence</strong><p>{rate}%</p></div>
        <div className="card"><strong>Total séances</strong><p>{attendance.length}</p></div>
        <div className="card"><strong>Présent</strong><p>{presentCount}</p></div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cours</th>
              <th>Jour</th>
              <th>Heure</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((item) => (
              <tr key={item.id_attendance}>
                <td>{item.nom_cours}</td>
                <td>{item.date_presence}</td>
                <td>{item.heure_debut} - {item.heure_fin}</td>
                <td><span className={`status-badge status-${item.statut}`}>{item.statut}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PresencesEtudiant
