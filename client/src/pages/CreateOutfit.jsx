import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { OUTFIT_OPTIONS } from '../utilities/outfitOptions.js'
import { calcPrice } from '../utilities/calcPrice.js'
import { validateOutfit } from '../utilities/validateOutfit.js'
import { createOutfit } from '../services/OutfitsAPI.js'
import '../css/CreateOutfit.css'

// Placeholder fashion images per option key (using picsum with consistent seeds)
const OPTION_IMAGES = {
  // tops
  blazer:          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop',
  tshirt:          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
  hoodie:          'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=200&fit=crop',
  athletic_top:    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=200&h=200&fit=crop',
  // bottoms
  dress_pants:     'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop',
  jeans:           'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
  athletic_shorts: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=200&h=200&fit=crop',
  skirt:           'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=200&fit=crop',
  // shoes
  dress_shoes:     'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=200&h=200&fit=crop',
  sneakers:        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
  running_shoes:   'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&h=200&fit=crop',
  sandals:         'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=200&fit=crop',
  // accessories
  tie:             'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=200&h=200&fit=crop',
  cap:             'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=200&fit=crop',
  watch:           'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
  headband:        'https://images.unsplash.com/photo-1617952739825-a0e6e3e5e1e1?w=200&h=200&fit=crop',
}

const CATEGORY_ICONS = {
  top: '👔',
  bottom: '👖',
  shoes: '👟',
  accessory: '💍',
}

function buildDefaultSelections() {
  const defaults = {}
  for (const category in OUTFIT_OPTIONS) {
    defaults[category] = OUTFIT_OPTIONS[category][0].key
  }
  return defaults
}

const CreateOutfit = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [selections, setSelections] = useState(buildDefaultSelections)
  const [openCategory, setOpenCategory] = useState(null)
  const [error, setError] = useState('')
  const dropdownRef = useRef(null)

  const totalPrice = calcPrice(selections, OUTFIT_OPTIONS)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenCategory(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleCategory(cat) {
    setOpenCategory(prev => (prev === cat ? null : cat))
  }

  function handleSelect(category, key) {
    setSelections(prev => ({ ...prev, [category]: key }))
    setOpenCategory(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const { valid, message } = validateOutfit(selections)
    if (!valid) { setError(message); return }
    try {
      await createOutfit({ name, ...selections, total_price: totalPrice })
      navigate('/outfits')
    } catch {
      setError('Failed to save outfit. Please try again.')
    }
  }

  const getSelectedLabel = (category) => {
    const opt = OUTFIT_OPTIONS[category].find(o => o.key === selections[category])
    return opt ? opt.label : '—'
  }

  return (
    <div className="co-page">
      <div className="co-header">
        <div className="co-header-left">
          <h1 className="co-title">Build Your Look</h1>
          <p className="co-subtitle">Click a category to choose your pieces</p>
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
          <button type="submit" className="btn-primary co-save-btn">Save Outfit</button>
        </form>
      </div>

      {error && <p className="error-message co-error">{error}</p>}

      {/* Category selector bar + dropdowns */}
      <div className="co-selector-bar" ref={dropdownRef}>
        {Object.keys(OUTFIT_OPTIONS).map(category => (
          <div key={category} className="co-category-wrap">
            <button
              type="button"
              className={`co-category-btn${openCategory === category ? ' open' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              <span className="co-cat-icon">{CATEGORY_ICONS[category]}</span>
              <span className="co-cat-info">
                <span className="co-cat-name">{category}</span>
                <span className="co-cat-selected">{getSelectedLabel(category)}</span>
              </span>
              <span className="co-cat-chevron">{openCategory === category ? '▲' : '▼'}</span>
            </button>

            {openCategory === category && (
              <div className="co-dropdown">
                {OUTFIT_OPTIONS[category].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`co-option${selections[category] === opt.key ? ' selected' : ''}`}
                    onClick={() => handleSelect(category, opt.key)}
                  >
                    <img
                      src={OPTION_IMAGES[opt.key]}
                      alt={opt.label}
                      className="co-option-img"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    <span className="co-option-label">{opt.label}</span>
                    <span className="co-option-price">${opt.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price badge bottom-right */}
      <div className="co-price-bar">
        <span className="co-price-label">Total</span>
        <span className="co-price-value">${totalPrice}</span>
      </div>
    </div>
  )
}

export default CreateOutfit
