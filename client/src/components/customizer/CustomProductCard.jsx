import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Upload } from 'lucide-react'
import ColorPicker from './ColorPicker'
import QuantitySelector from './QuantitySelector'

function CustomProductCard({
  item,
  selected,
  expanded,
  onExpand,
  onToggle,
  onChange,
}) {
  const [logoPreview, setLogoPreview] = useState('')

  const update = (key, value) => onChange(item.id, key, value)

  const handleLogo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (logoPreview) URL.revokeObjectURL(logoPreview)
    setLogoPreview(URL.createObjectURL(file))
    update('logoName', file.name)
  }

  const optionValues = (group) =>
    (group.values || []).map((value) =>
      typeof value === 'string'
        ? { label: value, value }
        : value
    )

  return (
    <article className={selected.enabled ? 'compact-product-card selected' : 'compact-product-card'}>
      <div className="compact-product-main">
        <div className="compact-product-image">
          <img src={item.image?.url} alt={item.name} loading="lazy" />
          {selected.enabled && (
            <span className="compact-product-check"><Check size={14} /></span>
          )}
        </div>

        <div className="compact-product-info">
          <span className="compact-product-label">Custom Item</span>
          <h3>{item.name}</h3>
          <p>{item.description}</p>

          {selected.enabled && (
            <div className="compact-product-summary">
              {selected.size && <span>Size: <strong>{selected.size}</strong></span>}
              <span>Color: <i style={{ background: selected.color }} /></span>
              <span>Qty: <strong>{selected.quantity}</strong></span>
            </div>
          )}
        </div>

        <div className="compact-product-actions">
          <button
            type="button"
            className={selected.enabled ? 'compact-select-button active' : 'compact-select-button'}
            onClick={() => onToggle(item.id)}
          >
            {selected.enabled ? 'Selected' : 'Select'}
          </button>

          {selected.enabled && (
            <button
              type="button"
              className="compact-customize-button"
              onClick={() => onExpand(item.id)}
            >
              Customize
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {selected.enabled && expanded && (
        <div className="compact-product-options">
          <div className="compact-option-section">
            <div className="compact-option-title">Size</div>
            <div className="customizer-size-grid">
              {(item.sizes || []).map((size) => (
                <button
                  type="button"
                  key={size}
                  className={selected.size === size ? 'active' : ''}
                  onClick={() => update('size', size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="compact-option-section">
            <ColorPicker
              colors={item.colors || []}
              value={selected.color}
              allowCustomColor={item.allowCustomColor}
              onChange={(color) => update('color', color)}
            />
          </div>

          {(item.optionGroups || []).map((group) => (
            <div className="compact-option-section" key={group.slug || group.name}>
              <div className="compact-option-title">{group.name}</div>
              <div className="customizer-choice-grid">
                {optionValues(group).map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className={selected.options?.[group.slug] === option.value ? 'active' : ''}
                    onClick={() =>
                      update('options', {
                        ...(selected.options || {}),
                        [group.slug]: option.value,
                      })
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {(item.allowPlayerName || item.allowPlayerNumber) && (
            <div className="compact-two-fields">
              {item.allowPlayerName && (
                <label>
                  Player Name
                  <input
                    value={selected.playerName}
                    onChange={(event) => update('playerName', event.target.value)}
                    placeholder="e.g. JOHN"
                    maxLength={30}
                  />
                </label>
              )}

              {item.allowPlayerNumber && (
                <label>
                  Player Number
                  <input
                    value={selected.playerNumber}
                    onChange={(event) => update('playerNumber', event.target.value)}
                    placeholder="e.g. 10"
                    maxLength={3}
                  />
                </label>
              )}
            </div>
          )}

          {item.allowLogoUpload && (
            <div className="compact-option-section">
              <div className="compact-option-title">Team Logo</div>
              <div className="compact-upload-row">
                <label className="compact-upload-button">
                  <Upload size={17} />
                  <span>{selected.logoName || 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogo}
                  />
                </label>
                {logoPreview && (
                  <img className="compact-logo-preview" src={logoPreview} alt="Logo preview" />
                )}
              </div>
            </div>
          )}

          <div className="compact-bottom-options">
            {item.allowCustomNotes && (
              <label className="compact-notes">
                Custom Instructions
                <textarea
                  value={selected.notes}
                  onChange={(event) => update('notes', event.target.value)}
                  placeholder="Patterns, collar, stripes, branding position..."
                  rows="3"
                />
              </label>
            )}

            <div className="compact-quantity-area">
              <span>Quantity</span>
              <QuantitySelector
                value={selected.quantity}
                onChange={(quantity) => update('quantity', quantity)}
              />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default CustomProductCard
