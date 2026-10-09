export const invalidInput = (message) => {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

export const readText = (value, label, { required = true, maxLength = 5000 } = {}) => {
  if (value === undefined && !required) return ''
  if (typeof value !== 'string') {
    throw invalidInput(`${label} must be text.`)
  }

  const text = value.trim()
  if (required && !text) throw invalidInput(`${label} is required.`)
  if (text.length > maxLength) {
    throw invalidInput(`${label} must be ${maxLength} characters or fewer.`)
  }

  return text
}

export const readArray = (value, label) => {
  let parsed = value

  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value)
    } catch {
      throw invalidInput(`${label} must contain valid JSON.`)
    }
  }

  if (!Array.isArray(parsed)) {
    throw invalidInput(`${label} must be a list.`)
  }

  return parsed
}

export const readNonNegativeInteger = (value, label, fallback = 0) => {
  if (value === undefined || value === '') return fallback
  const number = Number(value)
  if (!Number.isSafeInteger(number) || number < 0) {
    throw invalidInput(`${label} must be a non-negative whole number.`)
  }
  return number
}

export const readBoolean = (value, label, fallback = false) => {
  if (value === undefined || value === '') return fallback
  if ([true, 1, '1', 'true'].includes(value)) return true
  if ([false, 0, '0', 'false'].includes(value)) return false
  throw invalidInput(`${label} must be true or false.`)
}
