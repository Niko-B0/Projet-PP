import { NavLink } from 'react-router-dom'

function Sidebar({ items }) {
  return (
    <div className="card" style={{ minWidth: '220px' }}>
      <h2 style={{ marginTop: 0 }}>Navigation</h2>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
