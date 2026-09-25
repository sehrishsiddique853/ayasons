export const withImageWidth =
  (
    imageUrl,
    width
  ) => {
    if (
      !imageUrl ||
      !width
    ) {
      return imageUrl || ''
    }


    if (
      !imageUrl.includes(
        '/api/images/'
      )
    ) {
      return imageUrl
    }


    const separator =
      imageUrl.includes('?')
        ? '&'
        : '?'


    return `${imageUrl}${separator}w=${width}&v=2`
  }
