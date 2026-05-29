import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function ProfilEnseignant({ user }) {
  const [teacher, setTeacher] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/teachers/${user.id_teacher}`)
      .then(setTeacher)
      .catch((err) => setError(err.message))
  }, [user.id_teacher])

  return (
    <div>
      <h1 className="page-title">Profil enseignant</h1>
      <p className="subtitle">Vos informations professionnelles.</p>
      {error && <div className="error-message">{error}</div>}
      {teacher && (
        <div className="card">
          <p><strong>Nom :</strong> {teacher.nom}</p>
          <p><strong>Prénom :</strong> {teacher.prenom}</p>
          <p><strong>Email :</strong> {teacher.email}</p>
          <p><strong>Téléphone :</strong> {teacher.telephone}</p>
          <p><strong>Matière :</strong> {teacher.matiere}</p>
          <p><strong>Bureau :</strong> {teacher.bureau}</p>
          <button className="secondary" style={{ marginTop: 12 }}>Modifier</button>
        </div>
      )}
    </div>
  )
}

export default ProfilEnseignant
