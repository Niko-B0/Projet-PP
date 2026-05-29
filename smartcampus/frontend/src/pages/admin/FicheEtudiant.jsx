import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api.js'

function FicheEtudiant() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get(`/students/${id}`)
      .then(setStudent)
      .catch((err) => setError(err.message))
  }, [id])

  return (
    <div>
      <h1 className="page-title">Fiche étudiant</h1>
      {error && <div className="error-message">{error}</div>}
      {student ? (
        <>
          <div className="grid grid-3" style={{ marginBottom: 16 }}>
            <div className="card"><strong>Nom</strong><p>{student.nom} {student.prenom}</p></div>
            <div className="card"><strong>Niveau</strong><p>{student.niveau}</p></div>
            <div className="card"><strong>Spécialité</strong><p>{student.specialite}</p></div>
          </div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2>Cours suivis</h2>
            <ul>
              {student.courses?.map((course) => (
                <li key={course.id_course}>{course.nom_cours} ({course.semestre})</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h2>Notes et absences</h2>
            <p>Moyenne générale : {student.average ?? 'N/A'}</p>
            <p>Absences : {student.absenceCount ?? 0}</p>
          </div>
        </>
      ) : (
        <div className="card">Chargement du profil...</div>
      )}
    </div>
  )
}

export default FicheEtudiant
