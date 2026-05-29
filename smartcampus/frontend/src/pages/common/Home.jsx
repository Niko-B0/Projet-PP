import { Link } from 'react-router-dom'

const cards = [
  { title: 'Étudiant', description: 'Accédez à vos cours, notes et emplois du temps.', accent: '#22c55e' },
  { title: 'Enseignant', description: 'Gérez les notes, les présences et le planning.', accent: '#8b5cf6' },
  { title: 'Administrateur', description: 'Administrez étudiants, enseignants et cours.', accent: '#f59e0b' }
]

function Home() {
  return (
    <div className="page-container">
      <div className="card">
        <h1 className="page-title">SmartCampus</h1>
        <p className="subtitle">Plateforme académique unifiée</p>
        <div className="grid grid-3">
          {cards.map((item) => (
            <div key={item.title} className="card" style={{ borderColor: item.accent }}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '24px' }}>
          <Link to="/login">
            <button className="primary">Se connecter</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
