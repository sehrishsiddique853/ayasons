function ColorPicker({
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
        <span>Color</span>
        <strong>{String(value || '').toUpperCase()}</strong>
      </div>

      <div className="customizer-swatches">
        {normalized.map((color) => (
          <button
            key={color.value}
            type="button"
            className={value === color.value ? 'customizer-swatch active' : 'customizer-swatch'}
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
              value={value || '#080808'}
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
            value={value || '#080808'}
            onChange={(event) => onChange(event.target.value)}
          />
          <input
            type="text"
            value={value || ''}
            maxLength={7}
            onChange={(event) => onChange(event.target.value)}
            placeholder="#080808"
          />
        </label>
      )}
    </div>
  )
}

export default ColorPicker
