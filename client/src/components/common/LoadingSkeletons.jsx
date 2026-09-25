import '../../style/LoadingSkeletons.css'


export function ManufactureCardSkeletons({
  count = 4,
}) {
  return (
    <div className="manufacture-grid">
      {Array.from({
        length: count,
      }).map((_, index) => (
        <article
          className="manufacture-card manufacture-card-skeleton"
          key={`manufacture-skeleton-${index}`}
        >
          <span className="card-number">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="skeleton-card-content">
            <span className="skeleton-line skeleton-title" />
            <span className="skeleton-rule" />
            <span className="skeleton-line" />
            <span className="skeleton-line skeleton-short" />
            <span className="skeleton-button" />
          </div>
        </article>
      ))}
    </div>
  )
}


export function ProductCardSkeletons({
  count = 8,
}) {
  return (
    <div className="best-sellers-marquee best-sellers-skeleton-grid">
      {Array.from({
        length: count,
      }).map((_, index) => (
        <article
          className="best-seller-card best-seller-card-skeleton"
          key={`product-skeleton-${index}`}
        >
          <div className="best-seller-image-wrap skeleton-image-wrap">
            <span className="skeleton-pill skeleton-pill-brand" />
            <span className="skeleton-pill skeleton-pill-category" />
          </div>

          <div className="best-seller-content">
            <span className="skeleton-line skeleton-product-title" />
            <span className="skeleton-line" />
            <span className="skeleton-line skeleton-short" />
            <span className="skeleton-button" />
          </div>
        </article>
      ))}
    </div>
  )
}
