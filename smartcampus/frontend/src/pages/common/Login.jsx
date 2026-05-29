import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    try {
      const data = await api.post('/login', { email, password })
      onLogin(data)
      navigate(`/${data.role}/dashboard`, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h1 className="page-title">Connexion</h1>
        <p className="subtitle">Entrez votre email et mot de passe pour accéder à SmartCampus.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Mot de passe
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          <button className="primary" type="submit">Se connecter</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
