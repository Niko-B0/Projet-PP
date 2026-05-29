import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function GestionEmploiDuTemps() {
  const [slots, setSlots] = useState([])
  const [newSlot, setNewSlot] = useState({ id_course: '', jour: 'Lundi', heure_debut: '08:00', heure_fin: '10:00', salle: '' })
  const [courses, setCourses] = useState([])
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.get('/schedule')
      .then(setSlots)
      .catch((err) => setError(err.message))
    api.get('/courses')
      .then(setCourses)
      .catch(() => {})
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    try {
      await api.post('/schedule', newSlot)
      setMessage('Créneau créé')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">Gestion de l’emploi du temps</h1>
      <p className="subtitle">Consultez les horaires et ajoutez un nouveau créneau.</p>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="error-message" style={{ color: '#d9f99d' }}>{message}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Ajouter un créneau</h2>
        <form onSubmit={handleSubmit} className="grid" style={{ gap: 12 }}>
          <select value={newSlot.id_course} onChange={(e) => setNewSlot({ ...newSlot, id_course: e.target.value })} required>
            <option value="">Cours</option>
            {courses.map((course) => (
              <option key={course.id_course} value={course.id_course}>{course.nom_cours}</option>
            ))}
          </select>
          <select value={newSlot.jour} onChange={(e) => setNewSlot({ ...newSlot, jour: e.target.value })}>
            <option>Lundi</option>
            <option>Mardi</option>
            <option>Mercredi</option>
            <option>Jeudi</option>
            <option>Vendredi</option>
          </select>
          <input type="time" value={newSlot.heure_debut} onChange={(e) => setNewSlot({ ...newSlot, heure_debut: e.target.value })} required />
          <input type="time" value={newSlot.heure_fin} onChange={(e) => setNewSlot({ ...newSlot, heure_fin: e.target.value })} required />
          <input type="text" placeholder="Salle" value={newSlot.salle} onChange={(e) => setNewSlot({ ...newSlot, salle: e.target.value })} required />
          <button className="primary" type="submit">Créer</button>
        </form>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cours</th>
              <th>Jour</th>
              <th>Heure</th>
              <th>Salle</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id_slot}>
                <td>{slot.nom_cours}</td>
                <td>{slot.jour}</td>
                <td>{slot.heure_debut} - {slot.heure_fin}</td>
                <td>{slot.salle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GestionEmploiDuTemps
