import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function toForm(student) {
  return {
    nom: student.nom || '',
    prenom: student.prenom || '',
    email: student.email || '',
    telephone: student.telephone || '',
    date_naissance: student.date_naissance || '',
    numero_etudiant: student.numero_etudiant || '',
    niveau: student.niveau || '',
    specialite: student.specialite || '',
    annee_entree: student.annee_entree || ''
  }
}

function ProfilEtudiant({ user }) {
  const [student, setStudent] = useState(null)
  const [form, setForm] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const loadProfile = () => {
    api.get(`/students/${user.id_student}`)
      .then((data) => {
        setStudent(data)
        setForm(toForm(data))
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadProfile()
  }, [user.id_student])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleCancel = () => {
    setForm(toForm(student))
    setEditing(false)
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      await api.put(`/students/${user.id_student}`, {
        ...form,
        annee_entree: form.annee_entree ? Number(form.annee_entree) : null
      })
      setSuccess('Profil mis a jour.')
      setEditing(false)
      loadProfile()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Profil etudiant</h1>
      <p className="subtitle">Informations personnelles et academiques.</p>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {student && form && (
        <div className="card">
          {!editing ? (
            <>
              <p><strong>Nom :</strong> {student.nom}</p>
              <p><strong>Prenom :</strong> {student.prenom}</p>
              <p><strong>Email :</strong> {student.email}</p>
              <p><strong>Telephone :</strong> {student.telephone}</p>
              <p><strong>Numero etudiant :</strong> {student.numero_etudiant}</p>
              <p><strong>Niveau :</strong> {student.niveau}</p>
              <p><strong>Specialite :</strong> {student.specialite}</p>
              <p><strong>Annee d'entree :</strong> {student.annee_entree}</p>
              <button className="secondary" type="button" style={{ marginTop: 12 }} onClick={() => setEditing(true)}>
                Modifier
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
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
                  Telephone
                  <input name="telephone" value={form.telephone} onChange={handleChange} />
                </label>
                <label>
                  Numero etudiant
                  <input name="numero_etudiant" value={form.numero_etudiant} onChange={handleChange} />
                </label>
                <label>
                  Niveau
                  <input name="niveau" value={form.niveau} onChange={handleChange} />
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
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="primary" type="submit" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button className="secondary" type="button" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfilEtudiant
