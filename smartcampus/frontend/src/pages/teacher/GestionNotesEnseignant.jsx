import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function GestionNotesEnseignant({ user }) {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.get(`/teachers/${user.id_teacher}/courses`)
      .then(setCourses)
      .catch((err) => setError(err.message))
  }, [user.id_teacher])

  useEffect(() => {
    if (!selectedCourse) return
    api.get(`/courses/${selectedCourse}/students`)
      .then((data) => setStudents(data))
      .catch((err) => setError(err.message))
  }, [selectedCourse])

  const handleGradeChange = (enrollmentId, value) => {
    setStudents((current) => current.map((item) => item.enrollment_id === enrollmentId ? { ...item, valeur: value } : item))
  }

  const handleSave = async (enrollmentId, valeur) => {
    setError(null)
    setMessage(null)
    try {
      if (valeur === '' || valeur === null) {
        throw new Error('Entrez une note valide')
      }
      const numeric = parseFloat(valeur)
      if (Number.isNaN(numeric) || numeric < 0 || numeric > 20) {
        throw new Error('La note doit être entre 0 et 20')
      }
      await api.post('/grades', { id_enrollment: enrollmentId, valeur: numeric, type_evaluation: 'Contrôle', coef: 1 })
      setMessage('Note enregistrée')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">Gestion des notes</h1>
      <p className="subtitle">Sélectionnez un cours, puis saisissez les notes des étudiants.</p>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="error-message" style={{ color: '#d9f99d' }}>{message}</div>}
      <label>
        Choisir un cours
        <select value={selectedCourse || ''} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">-- Choisir --</option>
          {courses.map((course) => (
            <option key={course.id_course} value={course.id_course}>{course.nom_cours}</option>
          ))}
        </select>
      </label>
      {selectedCourse && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Note</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.enrollment_id}>
                  <td>{student.nom} {student.prenom}</td>
                  <td>
                    <input
                      value={student.valeur ?? ''}
                      onChange={(e) => handleGradeChange(student.enrollment_id, e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>{student.locked ? 'Verrouillée' : 'Editable'}</td>
                  <td>
                    <button className="primary" onClick={() => handleSave(student.enrollment_id, student.valeur)}>
                      Enregistrer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default GestionNotesEnseignant
