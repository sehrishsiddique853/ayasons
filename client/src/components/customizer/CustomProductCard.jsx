import {
  useState,
} from 'react'

import {
  Check,
  Upload,
} from 'lucide-react'

import ColorPicker
  from './ColorPicker'

import QuantitySelector
  from './QuantitySelector'


function CustomProductCard({
  item,
  selected,
  onToggle,
  onChange,
}) {
  const [
    logoPreview,
    setLogoPreview,
  ] = useState('')

  const update = (
    key,
    value
  ) => {
    onChange(
      item.id,
      key,
      value
    )
  }

  const handleLogo = (
    event
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const preview =
      URL.createObjectURL(file)

    setLogoPreview(preview)

    update(
      'logoName',
      file.name
    )
  }

  return (
    <article
      className={
        selected.enabled
          ? 'custom-product-card selected'
          : 'custom-product-card'
      }
    >

      <button
        type="button"
        className="custom-product-select"
        onClick={() =>
          onToggle(item.id)
        }
      >
        <span
          className="custom-product-checkbox"
        >
          {selected.enabled && (
            <Check size={16} />
          )}
        </span>

        <span>
          Add this item
        </span>
      </button>


      <div className="custom-product-card-head">

        <div>
          <span className="custom-product-kicker">
            Soccer Kit
          </span>

          <h2>
            {item.name}
          </h2>

          <p>
            {item.description}
          </p>
        </div>

      </div>


      {selected.enabled && (
        <div className="custom-product-options">

          <div className="customizer-block">

            <div className="customizer-field-heading">
              <span>
                Choose size
              </span>

              <strong>
                {selected.size ||
                  'Not selected'}
              </strong>
            </div>

            <div className="customizer-size-grid">

              {item.sizes.map(
                (size) => (
                  <button
                    type="button"
                    key={size}
                    className={
                      selected.size ===
                      size
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      update(
                        'size',
                        size
                      )
                    }
                  >
                    {size}
                  </button>
                )
              )}

            </div>

          </div>


          <ColorPicker
            colors={item.colors}
            value={
              selected.color
            }
            onChange={(color) =>
              update(
                'color',
                color
              )
            }
          />


          {item.options
            ?.sleeve && (
            <div className="customizer-block">

              <div className="customizer-field-heading">
                <span>
                  Sleeve
                </span>
              </div>

              <div className="customizer-choice-grid">

                {item.options.sleeve.map(
                  (option) => (
                    <button
                      type="button"
                      key={option}
                      className={
                        selected.sleeve ===
                        option
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        update(
                          'sleeve',
                          option
                        )
                      }
                    >
                      {option}
                    </button>
                  )
                )}

              </div>

            </div>
          )}


          {item.playerDetails && (
            <div className="customizer-two-columns">

              <label>
                Player name

                <input
                  type="text"
                  value={
                    selected.playerName
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      'playerName',
                      event.target.value
                    )
                  }
                  placeholder="e.g. JOHN"
                  maxLength={30}
                />
              </label>


              <label>
                Player number

                <input
                  type="text"
                  value={
                    selected.playerNumber
                  }
                  onChange={(
                    event
                  ) =>
                    update(
                      'playerNumber',
                      event.target.value
                    )
                  }
                  placeholder="e.g. 10"
                  maxLength={3}
                />
              </label>

            </div>
          )}


          {!item.playerDetails &&
            item.playerNumber && (
            <label className="customizer-input-label">

              Player number

              <input
                type="text"
                value={
                  selected.playerNumber
                }
                onChange={(
                  event
                ) =>
                  update(
                    'playerNumber',
                    event.target.value
                  )
                }
                placeholder="Optional"
                maxLength={3}
              />

            </label>
          )}


          {item.logoUpload && (
            <div className="customizer-block">

              <div className="customizer-field-heading">
                <span>
                  Team logo
                </span>
              </div>

              <label className="customizer-upload">

                <Upload size={20} />

                <span>
                  {selected.logoName ||
                    'Upload team logo'}
                </span>

                <small>
                  PNG, JPG or WEBP
                </small>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={
                    handleLogo
                  }
                />

              </label>


              {logoPreview && (
                <div className="customizer-logo-preview">
                  <img
                    src={logoPreview}
                    alt="Team logo preview"
                  />
                </div>
              )}

            </div>
          )}


          <label className="customizer-input-label">

            Custom instructions

            <textarea
              value={
                selected.notes
              }
              onChange={(
                event
              ) =>
                update(
                  'notes',
                  event.target.value
                )
              }
              placeholder="Tell us about stripes, patterns, logo position, collar style, special stitching or any other customization..."
              rows="4"
            />

          </label>


          <div className="customizer-bottom-row">

            <div>
              <span className="customizer-bottom-label">
                Quantity
              </span>

              <QuantitySelector
                value={
                  selected.quantity
                }
                onChange={(
                  quantity
                ) =>
                  update(
                    'quantity',
                    quantity
                  )
                }
              />
            </div>


            <div className="customizer-selection-summary">

              <span>
                Selected configuration
              </span>

              <strong>
                {selected.size ||
                  'Choose size'}
                {' · '}
                <i
                  style={{
                    background:
                      selected.color,
                  }}
                />
                {selected.color}
              </strong>

            </div>

          </div>

        </div>
      )}

    </article>
  )
}

export default CustomProductCard