import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllOutfits, deleteOutfit } from '../services/OutfitsAPI.js'
import '../App.css'
import top from '/top.svg'
import pants from '/pants.svg'
import shoes from '/Running_shoe_icon.png'
import accessories from '/accessories.svg'

const ViewOutfits = () => {
  const [outfits, setOutfits] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAllOutfits()
      .then(data => setOutfits(data))
      .catch(() => setError('Failed to load outfits.'))
  }, [])

  async function handleDelete(id) {
    try {
      await deleteOutfit(id)
      setOutfits(prev => prev.filter(o => o.id !== id))
    } catch {
      setError('Failed to delete outfit.')
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">My Outfits</h1>
      <p className="page-subtitle">Your saved looks, all in one place.</p>

      {error && <p className="error-message">{error}</p>}

      {outfits.length === 0 ? (
        <div className="empty-state">
          <p>No outfits saved yet</p>
          <Link to="/" className="btn-primary">Create Your First Look</Link>
        </div>
      ) : (
        <div className="outfits-grid">
          {outfits.map(outfit => (
            <div key={outfit.id} className="outfit-card">
              <Link to={`/outfits/${outfit.id}`} className="outfit-card-link">
                <h2>{outfit.name}</h2>
                <div className="outfit-card-tags">
                  <span className="outfit-tag"> <img src={top} alt={outfit.top} className="eo-cat-icon"/> {outfit.top}</span>
                  <span className="outfit-tag"> <img src={pants} alt={outfit.bottom} className="eo-cat-icon"/> {outfit.bottom}</span>
                  <span className="outfit-tag"> <img src={shoes} alt={outfit.shoes} className="eo-cat-icon"/> {outfit.shoes}</span>
                  <span className="outfit-tag"> <img src={accessories} alt={outfit.accessory} className="eo-cat-icon"/> {outfit.accessory}</span>
                </div>
                <p className="outfit-card-price">${outfit.total_price}</p>
              </Link>
              <div className="outfit-card-footer">
                <button className="btn-danger" onClick={() => handleDelete(outfit.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewOutfits
