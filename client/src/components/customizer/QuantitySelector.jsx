function QuantitySelector({
  value,
  onChange,
}) {
  const decrease = () => {
    onChange(
      Math.max(
        1,
        Number(value) - 1
      )
    )
  }

  const increase = () => {
    onChange(
      Number(value) + 1
    )
  }

  return (
    <div className="customizer-quantity">
      <button
        type="button"
        onClick={decrease}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <input
        type="number"
        min="1"
        value={value}
        onChange={(event) =>
          onChange(
            Math.max(
              1,
              Number(
                event.target.value
              ) || 1
            )
          )
        }
      />

      <button
        type="button"
        onClick={increase}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector