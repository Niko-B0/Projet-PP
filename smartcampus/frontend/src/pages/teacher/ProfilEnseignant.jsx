import { useEffect, useState } from 'react'
import api from '../../services/api.js'

function toForm(teacher) {
  return {
    nom: teacher.nom || '',
    prenom: teacher.prenom || '',
    email: teacher.email || '',
    telephone: teacher.telephone || '',
    matiere: teacher.matiere || '',
    bureau: teacher.bureau || ''
  }
}

function ProfilEnseignant({ user }) {
  const [teacher, setTeacher] = useState(null)
  const [form, setForm] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const loadProfile = () => {
    api.get(`/teachers/${user.id_teacher}`)
      .then((data) => {
        setTeacher(data)
        setForm(toForm(data))
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadProfile()
  }, [user.id_teacher])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleCancel = () => {
    setForm(toForm(teacher))
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
      await api.put(`/teachers/${user.id_teacher}`, form)
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
      <h1 className="page-title">Profil enseignant</h1>
      <p className="subtitle">Vos informations professionnelles.</p>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {teacher && form && (
        <div className="card">
          {!editing ? (
            <>
              <p><strong>Nom :</strong> {teacher.nom}</p>
              <p><strong>Prenom :</strong> {teacher.prenom}</p>
              <p><strong>Email :</strong> {teacher.email}</p>
              <p><strong>Telephone :</strong> {teacher.telephone}</p>
              <p><strong>Matiere :</strong> {teacher.matiere}</p>
              <p><strong>Bureau :</strong> {teacher.bureau}</p>
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
                  Matiere
                  <input name="matiere" value={form.matiere} onChange={handleChange} />
                </label>
                <label>
                  Bureau
                  <input name="bureau" value={form.bureau} onChange={handleChange} />
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

export default ProfilEnseignant
