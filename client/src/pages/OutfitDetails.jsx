import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOptions, getOutfitById, deleteOutfit } from '../services/OutfitsAPI.js'
import { calcPrice } from '../utilities/calcPrice.js'
import '../App.css'

const OutfitDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [outfit, setOutfit] = useState(null)
  const [options, setOptions] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getOutfitById(id), getOptions()])
      .then(([o, opts]) => { setOutfit(o); setOptions(opts) })
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
  if (!outfit || !options) return <div className="loading">Loading...</div>

  const getLabel = (category, key) => options[category]?.find(o => o.key === key)?.label ?? key

  const totalPrice = calcPrice(
    { top: outfit.top, bottom: outfit.bottom, shoes: outfit.shoes, accessory: outfit.accessory },
    options
  )

  const ICONS = { top: '/top.svg', bottom: '/pants.svg', shoes: '/Running_shoe_icon.png', accessory: '/accessories.svg' }

  return (
    <div className="page">
      <h1 className="page-title">{outfit.name}</h1>
      <p className="page-subtitle">Outfit details</p>

      <div className="card">
        <div className="detail-grid">
          {['top', 'bottom', 'shoes', 'accessory'].map(cat => (
            <div key={cat} className="detail-item">
              <div className="label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
              <div className="value"><img src={ICONS[cat]} alt={cat} style={{width:'18px',height:'18px',objectFit:'contain',marginRight:'6px',verticalAlign:'middle'}} />{getLabel(cat, outfit[cat])}</div>
            </div>
          ))}
        </div>

        <div className="total-price">Total: ${totalPrice}</div>

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
