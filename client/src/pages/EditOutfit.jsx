import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOptions, getOutfitById, updateOutfit } from '../services/OutfitsAPI.js'
import { calcPrice } from '../utilities/calcPrice.js'
import '../css/EditOutfit.css'

const CATEGORY_ICONS = {
  top:       '/top.svg',
  bottom:    '/pants.svg',
  shoes:     '/Running_shoe_icon.png',
  accessory: '/accessories.svg',
}

const EditOutfit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [options, setOptions] = useState(null)
  const [name, setName] = useState('')
  const [selections, setSelections] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getOptions(), getOutfitById(id)])
      .then(([opts, outfit]) => {
        setOptions(opts)
        setName(outfit.name)
        setSelections({ top: outfit.top, bottom: outfit.bottom, shoes: outfit.shoes, accessory: outfit.accessory })
      })
      .catch(() => setError('Failed to load outfit.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleSelect(category, key) {
    setSelections(prev => ({ ...prev, [category]: key }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await updateOutfit(id, { name, ...selections, total_price: calcPrice(selections, options) })
      navigate('/outfits')
    } catch {
      setError('Failed to update outfit. Please try again.')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!options) return <div className="loading">Loading options...</div>

  return (
    <div className="eo-page">
      {/* Top bar */}
      <div className="eo-header">
        <div className="eo-header-left">
          <h1 className="eo-title">Edit Your Look</h1>
          <p className="eo-subtitle">Select a piece from each category</p>
        </div>
        <form className="co-header-right" onSubmit={handleSubmit}>
          <div className="co-name-field">
            <label htmlFor="outfit-name">Outfit Name</label>
            <input
              id="outfit-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Sunday Brunch Look"
            />
          </div>
          <button type="submit" className="btn-primary co-save-btn">Update Outfit</button>
        </form>
      </div>

      {error && <p className="error-message eo-error">{error}</p>}

      {/* One section per category */}
      <div className="eo-categories">
        {Object.keys(options).map(category => (
          <div key={category} className="eo-category">
            <div className="eo-category-header">
              <img src={CATEGORY_ICONS[category]} alt={category} className="eo-cat-icon" />
              <h3 className="eo-cat-name">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            </div>

            {/* 2×2 image grid */}
            <div className="eo-grid">
              {options[category].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  className={`eo-tile${selections[category] === opt.key ? ' selected' : ''}`}
                  onClick={() => handleSelect(category, opt.key)}
                >
                  <img
                    src={opt.image_url}
                    alt={opt.label}
                    className="eo-tile-img"
                    onError={e => { e.target.style.background = '#f3e8ff' }}
                  />
                  <div className="eo-tile-info">
                    <span className="eo-tile-label">{opt.label}</span>
                    <span className="eo-tile-price">${opt.price}</span>
                  </div>
                  {selections[category] === opt.key && (
                    <div className="eo-tile-check">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Price badge */}
      <div className="co-price-bar">
        <span className="co-price-label">Total</span>
        <span className="co-price-value">${calcPrice(selections, options)}</span>
      </div>
    </div>
  )
}

export default EditOutfit
