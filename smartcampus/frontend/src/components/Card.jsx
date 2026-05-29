function Card({ title, children }) {
  return (
    <div className="card">
      {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
      {children}
    </div>
  )
}

export default Card
