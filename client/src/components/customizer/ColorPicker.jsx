function ColorPicker({
  label = 'Color',
  colors = [],
  value,
  onChange,
  allowCustomColor = true,
}) {
  const normalized = colors.map((color) =>
    typeof color === 'string'
      ? { name: color, value: color }
      : color
  )

  return (
    <div className="customizer-color-area">
      <div className="customizer-field-heading">
        <span>{label}</span>
        <strong>
          {value ? String(value).toUpperCase() : 'Select color'}
        </strong>
      </div>

      <div className="customizer-swatches">
        {normalized.map((color) => (
          <button
            key={color.value}
            type="button"
            className={
              value === color.value
                ? 'customizer-swatch active'
                : 'customizer-swatch'
            }
            style={{ backgroundColor: color.value }}
            title={color.name || color.value}
            aria-label={`Select ${color.name || color.value}`}
            onClick={() => onChange(color.value)}
          />
        ))}

        {allowCustomColor && (
          <label className="customizer-custom-color" title="Choose any color">
            <span>+</span>
            <input
              type="color"
              value={value || '#ffffff'}
              onChange={(event) => onChange(event.target.value)}
            />
          </label>
        )}
      </div>

      {allowCustomColor && (
        <label className="customizer-color-picker-row">
          <span>Custom color</span>
          <input
            type="color"
            value={value || '#ffffff'}
            onChange={(event) => onChange(event.target.value)}
          />
          <input
            type="text"
            value={value || ''}
            maxLength={7}
            onChange={(event) => onChange(event.target.value)}
            placeholder="#RRGGBB"
          />
        </label>
      )}
    </div>
  )
}

export default ColorPicker
