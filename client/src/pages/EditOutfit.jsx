import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { OUTFIT_OPTIONS } from '../utilities/outfitOptions.js'
import { calcPrice } from '../utilities/calcPrice.js'
import { validateOutfit } from '../utilities/validateOutfit.js'
import { getOutfitById, updateOutfit } from '../services/OutfitsAPI.js'
import '../App.css'

const TOP_EMOJI = {
  blazer: '🥼',
  tshirt: '👕',
  hoodie: '🧥',
  athletic_top: '🎽',
}

const EditOutfit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [selections, setSelections] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOutfit() {
      try {
        const outfit = await getOutfitById(id)
        setName(outfit.name)
        setSelections({ top: outfit.top, bottom: outfit.bottom, shoes: outfit.shoes, accessory: outfit.accessory })
      } catch {
        setError('Failed to load outfit.')
      } finally {
        setLoading(false)
      }
    }
    fetchOutfit()
  }, [id])

  const totalPrice = calcPrice(selections, OUTFIT_OPTIONS)

  function handleSelect(category, key) {
    setSelections(prev => ({ ...prev, [category]: key }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const { valid, message } = validateOutfit(selections)
    if (!valid) { setError(message); return }
    try {
      await updateOutfit(id, { name, ...selections, total_price: totalPrice })
      navigate('/outfits')
    } catch {
      setError('Failed to update outfit. Please try again.')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1 className="page-title">Edit Your Look</h1>
      <p className="page-subtitle">Update your outfit selections below.</p>

      <div className="card">
        <div className="outfit-visual" aria-label="Outfit preview">
          <span className="outfit-emoji">{TOP_EMOJI[selections.top] ?? '👕'}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field-group">
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

          {Object.entries(OUTFIT_OPTIONS).map(([category, options]) => (
            <div key={category} className="selector-group">
              <h3>{category}</h3>
              <div className="options-row">
                {options.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`option-btn${selections[category] === opt.key ? ' selected' : ''}`}
                    onClick={() => handleSelect(category, opt.key)}
                  >
                    {opt.label} · ${opt.price}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="total-price">✨ Total: ${totalPrice}</div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-primary">Update Outfit</button>
        </form>
      </div>
    </div>
  )
}

export default EditOutfit
