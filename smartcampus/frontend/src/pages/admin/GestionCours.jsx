import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function GestionCours() {
  const [courses, setCourses] = useState([])
  const [semester, setSemester] = useState('')
  const [level, setLevel] = useState('')
  const [subject, setSubject] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadCourses = () => {
    api.get('/courses')
      .then(setCourses)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleDelete = async (course) => {
    const confirmed = window.confirm(`Supprimer le cours "${course.nom_cours}" ?`)
    if (!confirmed) {
      return
    }

    setError(null)
    setSuccess(null)
    setDeletingId(course.id_course)
    try {
      await api.delete(`/courses/${course.id_course}`)
      setSuccess('Cours supprime avec succes.')
      loadCourses()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = courses.filter((course) => {
    const matchSemester = semester === '' || String(course.semestre) === semester
    const matchLevel = level === '' || course.niveau === level
    const matchSubject = subject === '' || course.matiere === subject
    return matchSemester && matchLevel && matchSubject
  })

  const levels = Array.from(new Set(courses.map((course) => course.niveau).filter(Boolean)))
  const subjects = Array.from(new Set(courses.map((course) => course.matiere).filter(Boolean)))

  return (
    <div>
      <h1 className="page-title">Gestion des cours</h1>
      <p className="subtitle">Liste des cours, filtres et suppression des cours.</p>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <label>
          Semestre
          <select value={semester} onChange={(event) => setSemester(event.target.value)}>
            <option value="">Tous semestres</option>
            <option value="1">Semestre 1</option>
            <option value="2">Semestre 2</option>
            <option value="3">Semestre 3</option>
          </select>
        </label>
        <label>
          Niveau
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="">Tous niveaux</option>
            {levels.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Matiere
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="">Toutes matieres</option>
            {subjects.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Enseignant responsable</th>
              <th>Semestre</th>
              <th>Niveau</th>
              <th>Matiere</th>
              <th>Inscrits</th>
              <th>Capacite</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((course) => (
              <tr key={course.id_course}>
                <td>{course.nom_cours}</td>
                <td>{course.teacher_name}</td>
                <td>{course.semestre}</td>
                <td>{course.niveau}</td>
                <td>{course.matiere}</td>
                <td>{course.enrolled_count}</td>
                <td>{course.capacite}</td>
                <td>
                  <button
                    className="secondary"
                    type="button"
                    disabled={deletingId === course.id_course}
                    onClick={() => handleDelete(course)}
                  >
                    {deletingId === course.id_course ? 'Suppression...' : 'Supprimer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GestionCours
