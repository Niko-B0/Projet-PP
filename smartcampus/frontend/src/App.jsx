import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import api from './services/api.js'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/common/Home.jsx'
import Login from './pages/common/Login.jsx'
import TableauDeBordEtudiant from './pages/student/TableauDeBordEtudiant.jsx'
import MesCoursEtudiant from './pages/student/MesCoursEtudiant.jsx'
import InscriptionCoursEtudiant from './pages/student/InscriptionCoursEtudiant.jsx'
import MesNotesEtudiant from './pages/student/MesNotesEtudiant.jsx'
import EmploiDuTempsEtudiant from './pages/student/EmploiDuTempsEtudiant.jsx'
import PresencesEtudiant from './pages/student/PresencesEtudiant.jsx'
import ProfilEtudiant from './pages/student/ProfilEtudiant.jsx'
import TableauDeBordEnseignant from './pages/teacher/TableauDeBordEnseignant.jsx'
import MesCoursEnseignant from './pages/teacher/MesCoursEnseignant.jsx'
import EmploiDuTempsEnseignant from './pages/teacher/EmploiDuTempsEnseignant.jsx'
import GestionNotesEnseignant from './pages/teacher/GestionNotesEnseignant.jsx'
import GestionPresencesEnseignant from './pages/teacher/GestionPresencesEnseignant.jsx'
import ProfilEnseignant from './pages/teacher/ProfilEnseignant.jsx'
import TableauDeBordAdmin from './pages/admin/TableauDeBordAdmin.jsx'
import GestionEtudiants from './pages/admin/GestionEtudiants.jsx'
import FicheEtudiant from './pages/admin/FicheEtudiant.jsx'
import GestionEnseignants from './pages/admin/GestionEnseignants.jsx'
import GestionCours from './pages/admin/GestionCours.jsx'
import GestionEmploiDuTemps from './pages/admin/GestionEmploiDuTemps.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/me')
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await api.post('/logout')
    setUser(null)
  }

  if (loading) {
    return <div className="page-container">Chargement...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <Login onLogin={setUser} />}
        />

        <Route
          path="/student/*"
          element={
            <ProtectedRoute user={user} role="student">
              <Layout user={user} role="student" onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<TableauDeBordEtudiant user={user} />} />
                  <Route path="courses" element={<MesCoursEtudiant user={user} />} />
                  <Route path="registration" element={<InscriptionCoursEtudiant user={user} />} />
                  <Route path="grades" element={<MesNotesEtudiant user={user} />} />
                  <Route path="schedule" element={<EmploiDuTempsEtudiant user={user} />} />
                  <Route path="attendance" element={<PresencesEtudiant user={user} />} />
                  <Route path="profile" element={<ProfilEtudiant user={user} />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute user={user} role="teacher">
              <Layout user={user} role="teacher" onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<TableauDeBordEnseignant user={user} />} />
                  <Route path="courses" element={<MesCoursEnseignant user={user} />} />
                  <Route path="schedule" element={<EmploiDuTempsEnseignant user={user} />} />
                  <Route path="grades" element={<GestionNotesEnseignant user={user} />} />
                  <Route path="attendance" element={<GestionPresencesEnseignant user={user} />} />
                  <Route path="profile" element={<ProfilEnseignant user={user} />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute user={user} role="admin">
              <Layout user={user} role="admin" onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<TableauDeBordAdmin user={user} />} />
                  <Route path="students" element={<GestionEtudiants />} />
                  <Route path="students/:id" element={<FicheEtudiant />} />
                  <Route path="teachers" element={<GestionEnseignants />} />
                  <Route path="courses" element={<GestionCours />} />
                  <Route path="schedule" element={<GestionEmploiDuTemps />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {error && <div className="global-error">{error}</div>}
    </BrowserRouter>
  )
}

export default App
