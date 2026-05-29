import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function ProfilEtudiant({ user }) {
  const [student, setStudent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/students/${user.id_student}`)
      .then(setStudent)
      .catch((err) => setError(err.message))
  }, [user.id_student])

  return (
    <div>
      <h1 className="page-title">Profil étudiant</h1>
      <p className="subtitle">Informations personnelles et académiques.</p>
      {error && <div className="error-message">{error}</div>}
      {student && (
        <div className="card">
          <p><strong>Nom :</strong> {student.nom}</p>
          <p><strong>Prénom :</strong> {student.prenom}</p>
          <p><strong>Email :</strong> {student.email}</p>
          <p><strong>Téléphone :</strong> {student.telephone}</p>
          <p><strong>Numéro étudiant :</strong> {student.numero_etudiant}</p>
          <p><strong>Niveau :</strong> {student.niveau}</p>
          <p><strong>Spécialité :</strong> {student.specialite}</p>
          <p><strong>Année d’entrée :</strong> {student.annee_entree}</p>
          <button className="secondary" style={{ marginTop: 12 }}>Modifier</button>
        </div>
      )}
    </div>
  )
}

export default ProfilEtudiant
