import '../../style/PageLoader.css'


function PageLoader({
  label = 'Loading',
  variant = 'page',
}) {
  return (
    <div
      className={`page-loader page-loader-${variant}`}
      role="status"
      aria-live="polite"
    >
      <div className="page-loader-mark">
        <span />
        <span />
        <span />
      </div>

      <p>
        {label}
      </p>
    </div>
  )
}


export default PageLoader
