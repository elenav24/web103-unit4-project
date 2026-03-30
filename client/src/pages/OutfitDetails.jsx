import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOutfitById, deleteOutfit } from '../services/OutfitsAPI.js'
import { calcPrice } from '../utilities/calcPrice.js'
import { OUTFIT_OPTIONS } from '../utilities/outfitOptions.js'
import '../App.css'

const getLabel = (category, key) => {
  const option = OUTFIT_OPTIONS[category]?.find(o => o.key === key)
  return option ? option.label : key
}

const OutfitDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [outfit, setOutfit] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOutfitById(id)
      .then(setOutfit)
      .catch(() => setError('Failed to load outfit.'))
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteOutfit(id)
      navigate('/outfits')
    } catch {
      setError('Failed to delete outfit.')
    }
  }

  if (error) return <div className="page"><p className="error-message">{error}</p></div>
  if (!outfit) return <div className="loading">Loading...</div>

  const selections = { top: outfit.top, bottom: outfit.bottom, shoes: outfit.shoes, accessory: outfit.accessory }
  const totalPrice = calcPrice(selections, OUTFIT_OPTIONS)

  return (
    <div className="page">
      <h1 className="page-title">{outfit.name}</h1>
      <p className="page-subtitle">Outfit details</p>

      <div className="card">
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Top</div>
            <div className="value">👕 {getLabel('top', outfit.top)}</div>
          </div>
          <div className="detail-item">
            <div className="label">Bottom</div>
            <div className="value">👖 {getLabel('bottom', outfit.bottom)}</div>
          </div>
          <div className="detail-item">
            <div className="label">Shoes</div>
            <div className="value">👟 {getLabel('shoes', outfit.shoes)}</div>
          </div>
          <div className="detail-item">
            <div className="label">Accessory</div>
            <div className="value">💍 {getLabel('accessory', outfit.accessory)}</div>
          </div>
        </div>

        <div className="total-price">✨ Total: ${totalPrice}</div>

        {error && <p className="error-message">{error}</p>}

        <div className="detail-actions">
          <button className="btn-secondary" onClick={() => navigate(`/edit/${id}`)}>Edit Outfit</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default OutfitDetails
