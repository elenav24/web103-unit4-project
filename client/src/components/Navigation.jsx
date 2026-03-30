import '../css/Navigation.css'

const Navigation = () => {
  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <img src="/favicon.png" className="nav-logo" alt="Fit Check Logo" width="32" height="32" />
        <h1>Fit Check</h1>
      </div>
      <ul className="nav-links">
        <li><a href="/">Create Outfit</a></li>
        <li><a href="/outfits">My Outfits</a></li>
      </ul>
    </nav>
  )
}

export default Navigation
