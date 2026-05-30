import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'

const currentYear = new Date().getFullYear()

const emptyForm = {
  nom: '',
  prenom: '',
  email: '',
  password: 'password123',
  telephone: '',
  niveau: 'Licence 1',
  specialite: '',
  numero_etudiant: '',
  annee_entree: currentYear
}

function GestionEtudiants() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const loadStudents = () => {
    api.get('/students')
      .then(setStudents)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setCreating(true)
    try {
      await api.post('/students', {
        ...form,
        annee_entree: form.annee_entree ? Number(form.annee_entree) : null
      })
      setSuccess('Etudiant ajoute avec succes.')
      setForm(emptyForm)
      loadStudents()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const filtered = students.filter((student) => {
    return (
      student.nom.toLowerCase().includes(search.toLowerCase()) ||
      student.prenom.toLowerCase().includes(search.toLowerCase())
    ) && (filter === '' || student.niveau === filter)
  })

  return (
    <div>
      <h1 className="page-title">Gestion des etudiants</h1>
      <p className="subtitle">Rechercher, ajouter et consulter les fiches des etudiants.</p>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="panel" style={{ marginBottom: 20 }}>
        <h2>Ajouter un etudiant</h2>
        <form onSubmit={handleCreate}>
          <div className="grid grid-3">
            <label>
              Nom
              <input name="nom" value={form.nom} onChange={handleChange} required />
            </label>
            <label>
              Prenom
              <input name="prenom" value={form.prenom} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Mot de passe
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </label>
            <label>
              Telephone
              <input name="telephone" value={form.telephone} onChange={handleChange} />
            </label>
            <label>
              Numero etudiant
              <input name="numero_etudiant" value={form.numero_etudiant} onChange={handleChange} />
            </label>
            <label>
              Niveau
              <select name="niveau" value={form.niveau} onChange={handleChange}>
                <option value="Licence 1">Licence 1</option>
                <option value="Licence 2">Licence 2</option>
                <option value="Licence 3">Licence 3</option>
              </select>
            </label>
            <label>
              Specialite
              <input name="specialite" value={form.specialite} onChange={handleChange} />
            </label>
            <label>
              Annee d'entree
              <input name="annee_entree" type="number" min="2000" max="2100" value={form.annee_entree} onChange={handleChange} />
            </label>
          </div>
          <button className="primary" type="submit" disabled={creating} style={{ marginTop: 16 }}>
            {creating ? 'Ajout...' : 'Ajouter'}
          </button>
        </form>
      </div>

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
              <th>Specialite</th>
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
