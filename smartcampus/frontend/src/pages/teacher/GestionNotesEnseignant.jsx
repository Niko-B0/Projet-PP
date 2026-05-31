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

  const loadStudents = () => {
    if (!selectedCourse) return
    api.get(`/courses/${selectedCourse}/students`)
      .then((data) => setStudents(data))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadStudents()
  }, [selectedCourse])

  const handleGradeChange = (enrollmentId, value) => {
    setStudents((current) => current.map((item) => item.enrollment_id === enrollmentId ? { ...item, valeur: value } : item))
  }

  const validateGrade = (valeur) => {
    if (valeur === '' || valeur === null || valeur === undefined) {
      throw new Error('Entrez une note valide')
    }
    const numeric = parseFloat(valeur)
    if (Number.isNaN(numeric) || numeric < 0 || numeric > 20) {
      throw new Error('La note doit etre entre 0 et 20')
    }
    return numeric
  }

  const handleSave = async (student) => {
    setError(null)
    setMessage(null)
    try {
      const numeric = validateGrade(student.valeur)
      const payload = { id_enrollment: student.enrollment_id, valeur: numeric, type_evaluation: student.type_evaluation || 'Controle', coef: student.coef || 1 }
      if (student.id_grade) {
        await api.put(`/grades/${student.id_grade}`, payload)
      } else {
        await api.post('/grades', payload)
      }
      setMessage('Note enregistree')
      loadStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLock = async (student) => {
    setError(null)
    setMessage(null)
    try {
      if (!student.id_grade) {
        throw new Error('Enregistrez la note avant de la verrouiller')
      }
      await api.post(`/grades/${student.id_grade}/lock`)
      setMessage('Note verrouillee')
      loadStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (student) => {
    setError(null)
    setMessage(null)
    try {
      if (!student.id_grade) {
        throw new Error('Aucune note a supprimer')
      }
      const confirmed = window.confirm(`Supprimer la note de ${student.prenom} ${student.nom} ?`)
      if (!confirmed) return
      await api.delete(`/grades/${student.id_grade}`)
      setMessage('Note supprimee')
      loadStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">Gestion des notes</h1>
      <p className="subtitle">Selectionnez un cours, saisissez les notes, puis verrouillez-les apres validation.</p>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
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
                <th>Etudiant</th>
                <th>Note</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const locked = Boolean(Number(student.locked))
                return (
                  <tr key={student.enrollment_id}>
                    <td>{student.nom} {student.prenom}</td>
                    <td>
                      <input
                        value={student.valeur ?? ''}
                        onChange={(e) => handleGradeChange(student.enrollment_id, e.target.value)}
                        disabled={locked}
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>{locked ? 'Verrouillee' : 'Editable'}</td>
                    <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="primary" type="button" disabled={locked} onClick={() => handleSave(student)}>
                        Enregistrer
                      </button>
                      <button className="secondary" type="button" disabled={locked || !student.id_grade} onClick={() => handleLock(student)}>
                        Verrouiller
                      </button>
                      <button className="secondary" type="button" disabled={locked || !student.id_grade} onClick={() => handleDelete(student)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default GestionNotesEnseignant
