import { useEffect } from 'react'

const LOOK_AHEAD_DISTANCE = '1200px 0px'

function ImagePreloader() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      return undefined
    }

    const observedImages = new WeakSet()

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          const image = entry.target

          image.loading = 'eager'
          image.fetchPriority = 'auto'

          if (typeof image.decode === 'function') {
            image.decode().catch(() => {})
          }

          imageObserver.unobserve(image)
        })
      },
      {
        rootMargin: LOOK_AHEAD_DISTANCE,
      }
    )

    const observeImages = (root = document) => {
      root
        .querySelectorAll?.('img[loading="lazy"]')
        .forEach((image) => {
          if (observedImages.has(image)) {
            return
          }

          observedImages.add(image)
          image.classList.add('image-loading')

          const markLoaded = () => {
            image.classList.add('image-loaded')
          }

          if (image.complete) {
            markLoaded()
          } else {
            image.addEventListener('load', markLoaded, { once: true })
            image.addEventListener('error', markLoaded, { once: true })
          }

          imageObserver.observe(image)
        })
    }

    observeImages()

    const mutationObserver = new MutationObserver(() => {
      observeImages()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      mutationObserver.disconnect()
      imageObserver.disconnect()
    }
  }, [])

  return null
}

export default ImagePreloader
