import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOptions, createOutfit } from '../services/OutfitsAPI.js'
import { calcPrice } from '../utilities/calcPrice.js'
import '../css/CreateOutfit.css'

const CATEGORY_ICONS = {
  top:       '/top.svg',
  bottom:    '/pants.svg',
  shoes:     '/Running_shoe_icon.png',
  accessory: '/accessories.svg',
}

const CreateOutfit = () => {
  const navigate = useNavigate()
  const [options, setOptions] = useState(null)
  const [name, setName] = useState('')
  const [selections, setSelections] = useState({})
  const [openCategory, setOpenCategory] = useState(null)
  const [error, setError] = useState('')
  const dropdownRef = useRef(null)

  // Fetch options from server on mount
  useEffect(() => {
    getOptions()
      .then(data => {
        setOptions(data)
        // default to first option per category
        const defaults = {}
        for (const cat in data) defaults[cat] = data[cat][0].key
        setSelections(defaults)
      })
      .catch(() => setError('Failed to load outfit options.'))
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenCategory(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function calcTotal() {
    return calcPrice(selections, options)
  }

  function toggleCategory(cat) {
    setOpenCategory(prev => (prev === cat ? null : cat))
  }

  function handleSelect(category, key) {
    setSelections(prev => ({ ...prev, [category]: key }))
    setOpenCategory(null)
  }

  function getSelectedLabel(category) {
    const opt = options?.[category]?.find(o => o.key === selections[category])
    return opt ? opt.label : '—'
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await createOutfit({ name, ...selections, total_price: calcTotal() })
      navigate('/outfits')
    } catch {
      setError('Failed to save outfit. Please try again.')
    }
  }

  if (!options) return <div className="loading">Loading options...</div>

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

      <div className="co-selector-bar" ref={dropdownRef}>
        {Object.keys(options).map(category => (
          <div key={category} className="co-category-wrap">
            <button
              type="button"
              className={`co-category-btn${openCategory === category ? ' open' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              <img src={CATEGORY_ICONS[category]} alt={category} className="co-cat-icon" />
              <span className="co-cat-info">
                <span className="co-cat-name">{category}</span>
                <span className="co-cat-selected">{getSelectedLabel(category)}</span>
              </span>
              <span className="co-cat-chevron">{openCategory === category ? '▲' : '▼'}</span>
            </button>

            {openCategory === category && (
              <div className="co-dropdown">
                {options[category].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`co-option${selections[category] === opt.key ? ' selected' : ''}`}
                    onClick={() => handleSelect(category, opt.key)}
                  >
                    <img
                      src={opt.image_url}
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

      {/* Live outfit preview */}
      <div className="co-preview">
        <h3 className="co-preview-title">Your Look</h3>
        <div className="co-preview-grid">
          {Object.keys(options).map(category => {
            const selected = options[category].find(o => o.key === selections[category])
            return (
              <div key={category} className="co-preview-item">
                <img
                  src={selected?.image_url}
                  alt={selected?.label ?? category}
                  className="co-preview-img"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div className="co-preview-item-info">
                  <span className="co-preview-cat">{category}</span>
                  <span className="co-preview-label">{selected?.label ?? '—'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="co-price-bar">
        <span className="co-price-label">Total</span>
        <span className="co-price-value">${calcTotal()}</span>
      </div>
    </div>
  )
}

export default CreateOutfit
