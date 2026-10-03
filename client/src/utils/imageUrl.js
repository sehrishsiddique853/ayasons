export const withImageWidth = (
  imageUrl,
  width
) => {
  if (!imageUrl || !width) return imageUrl || ''

  const separator = imageUrl.includes('?') ? '&' : '?'
  return `${imageUrl}${separator}w=${Math.round(width)}`
}
