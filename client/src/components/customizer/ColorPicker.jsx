function ColorPicker({
  colors = [],
  value,
  onChange,
}) {
  return (
    <div className="customizer-color-area">

      <div className="customizer-field-heading">
        <span>Color</span>

        <strong>
          {value.toUpperCase()}
        </strong>
      </div>

      <div className="customizer-swatches">

        {colors.map(
          (color) => (
            <button
              key={color}
              type="button"
              className={
                value === color
                  ? 'customizer-swatch active'
                  : 'customizer-swatch'
              }
              style={{
                backgroundColor:
                  color,
              }}
              aria-label={`Select ${color}`}
              onClick={() =>
                onChange(color)
              }
            />
          )
        )}

        <label
          className="customizer-custom-color"
          title="Choose any color"
        >
          <span>+</span>

          <input
            type="color"
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
          />
        </label>

      </div>

      <label className="customizer-color-picker-row">

        <span>
          Custom color
        </span>

        <input
          type="color"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
        />

        <input
          type="text"
          value={value}
          maxLength={7}
          onChange={(event) => {
            const color =
              event.target.value

            onChange(color)
          }}
          placeholder="#080808"
        />

      </label>

    </div>
  )
}

export default ColorPicker