import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function GestionCours() {
  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/courses')
      .then(setCourses)
      .catch((err) => setError(err.message))
  }, [])

  const filtered = courses.filter((item) => filter === '' || item.niveau === filter)

  return (
    <div>
      <h1 className="page-title">Gestion des cours</h1>
      <p className="subtitle">Liste des cours actifs et leurs capacités.</p>
      {error && <div className="error-message">{error}</div>}
      <div style={{ marginBottom: 16 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Tous niveaux</option>
          <option value="Licence 1">Licence 1</option>
          <option value="Licence 2">Licence 2</option>
          <option value="Licence 3">Licence 3</option>
        </select>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Enseignant</th>
              <th>Niveau</th>
              <th>Inscrits</th>
              <th>Capacité</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((course) => (
              <tr key={course.id_course}>
                <td>{course.nom_cours}</td>
                <td>{course.teacher_name}</td>
                <td>{course.niveau}</td>
                <td>{course.enrolled_count}</td>
                <td>{course.capacite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GestionCours
