import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'

function GestionEtudiants() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/students')
      .then(setStudents)
      .catch((err) => setError(err.message))
  }, [])

  const filtered = students.filter((student) => {
    return (
      student.nom.toLowerCase().includes(search.toLowerCase()) ||
      student.prenom.toLowerCase().includes(search.toLowerCase())
    ) && (filter === '' || student.niveau === filter)
  })

  return (
    <div>
      <h1 className="page-title">Gestion des étudiants</h1>
      <p className="subtitle">Rechercher et consulter les fiches des étudiants.</p>
      {error && <div className="error-message">{error}</div>}
      <div className="grid" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end', marginBottom: 20 }}>
        <div>
          <input placeholder="Recherche..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous niveaux</option>
            <option value="Licence 1">Licence 1</option>
            <option value="Licence 2">Licence 2</option>
            <option value="Licence 3">Licence 3</option>
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Niveau</th>
              <th>Spécialité</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id_student}>
                <td>{student.nom} {student.prenom}</td>
                <td>{student.email}</td>
                <td>{student.niveau}</td>
                <td>{student.specialite}</td>
                <td>
                  <Link to={`/admin/students/${student.id_student}`} className="secondary">
                    Voir fiche
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GestionEtudiants
