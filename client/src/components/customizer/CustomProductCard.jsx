import { Check } from 'lucide-react'

function CustomProductCard({
  item,
  selected,
  active,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={
        active
          ? 'ecom-item-card active'
          : selected?.enabled
            ? 'ecom-item-card selected'
            : 'ecom-item-card'
      }
      onClick={() => onSelect(item.id)}
    >
      <div className="ecom-item-image">
        <img src={item.image?.url} alt={item.name} loading="lazy" />
        {selected?.enabled && (
          <span className="ecom-item-check">
            <Check size={13} />
          </span>
        )}
      </div>

      <div className="ecom-item-copy">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
    </button>
  )
}

export default CustomProductCard
