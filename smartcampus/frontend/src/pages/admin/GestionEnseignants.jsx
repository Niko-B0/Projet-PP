import { useEffect, useState } from 'react'
import api from '../../services/api.js'

const emptyForm = {
  nom: '',
  prenom: '',
  email: '',
  password: 'password123',
  telephone: '',
  matiere: '',
  bureau: ''
}

function GestionEnseignants() {
  const [teachers, setTeachers] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const loadTeachers = () => {
    api.get('/teachers')
      .then(setTeachers)
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadTeachers()
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
      await api.post('/teachers', form)
      setSuccess('Enseignant ajoute avec succes.')
      setForm(emptyForm)
      loadTeachers()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Gestion des enseignants</h1>
      <p className="subtitle">Ajouter des enseignants et consulter leurs cours.</p>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="panel" style={{ marginBottom: 20 }}>
        <h2>Ajouter un enseignant</h2>
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
              Matiere
              <input name="matiere" value={form.matiere} onChange={handleChange} />
            </label>
            <label>
              Bureau
              <input name="bureau" value={form.bureau} onChange={handleChange} />
            </label>
          </div>
          <button className="primary" type="submit" disabled={creating} style={{ marginTop: 16 }}>
            {creating ? 'Ajout...' : 'Ajouter'}
          </button>
        </form>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Matiere</th>
              <th>Nombre de cours</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id_teacher}>
                <td>{teacher.nom} {teacher.prenom}</td>
                <td>{teacher.email}</td>
                <td>{teacher.matiere}</td>
                <td>{teacher.courseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GestionEnseignants
