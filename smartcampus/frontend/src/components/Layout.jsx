import { NavLink } from 'react-router-dom'

const menus = {
  student: [
    { label: 'Tableau de bord', to: '/student/dashboard' },
    { label: 'Mes cours', to: '/student/courses' },
    { label: 'Inscription cours', to: '/student/registration' },
    { label: 'Mes notes', to: '/student/grades' },
    { label: 'Emploi du temps', to: '/student/schedule' },
    { label: 'Présences', to: '/student/attendance' },
    { label: 'Profil', to: '/student/profile' }
  ],
  teacher: [
    { label: 'Tableau de bord', to: '/teacher/dashboard' },
    { label: 'Mes cours', to: '/teacher/courses' },
    { label: 'Emploi du temps', to: '/teacher/schedule' },
    { label: 'Gestion notes', to: '/teacher/grades' },
    { label: 'Gestion présences', to: '/teacher/attendance' },
    { label: 'Profil', to: '/teacher/profile' }
  ],
  admin: [
    { label: 'Tableau de bord', to: '/admin/dashboard' },
    { label: 'Gestion étudiants', to: '/admin/students' },
    { label: 'Gestion enseignants', to: '/admin/teachers' },
    { label: 'Gestion cours', to: '/admin/courses' },
    { label: 'Gestion emploi du temps', to: '/admin/schedule' }
  ]
}

function Layout({ user, role, onLogout, children }) {
  return (
    <div className="page-container">
      <div className="topbar">
        <div>
          <h1 className="page-title">SmartCampus</h1>
          <p className="subtitle">Plateforme académique unifiée</p>
        </div>
        <div>
          <div style={{ marginBottom: '8px' }}>Bonjour, {user?.prenom} {user?.nom}</div>
          <button className="primary" onClick={onLogout}>Déconnexion</button>
        </div>
      </div>
      <div className="page-layout">
        <aside className="card" style={{ minWidth: '220px' }}>
          <h2 style={{ marginTop: 0 }}>Menu</h2>
          {menus[role]?.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default Layout
