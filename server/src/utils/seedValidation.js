const isPlainObject = (value) =>
  Boolean(value) &&
  typeof value === 'object' &&
  !Array.isArray(value)

const isDenseArray = (value) => {
  if (!Array.isArray(value)) return false

  for (let index = 0; index < value.length; index += 1) {
    if (!(index in value) || value[index] === undefined || value[index] === null) {
      return false
    }
  }

  return true
}

export const validSeedRecords = (records, label, validateExtra = () => true) => {
  if (!Array.isArray(records)) {
    console.warn(`[seed] Skipping ${label}: expected a list.`)
    return []
  }

  const valid = []

  for (let index = 0; index < records.length; index += 1) {
    const record = records[index]
    const name = record?.name ?? record?.product
    const arraysAreValid = isPlainObject(record) &&
      Object.entries(record).every(([key, value]) =>
        !Array.isArray(value) || isDenseArray(value)
      )
    const nestedGroups = record?.groups ?? record?.optionGroups
    const groupsAreValid = nestedGroups === undefined ||
      (isDenseArray(nestedGroups) && nestedGroups.every((group) => {
        if (!isPlainObject(group)) return false
        if ('title' in group) {
          return typeof group.title === 'string' &&
            isDenseArray(group.items) &&
            group.items.every((item) => typeof item === 'string')
        }

        return typeof group.name === 'string' &&
          typeof group.slug === 'string' &&
          isDenseArray(group.values)
      }))

    if (
      !isPlainObject(record) ||
      typeof name !== 'string' || !name.trim() ||
      (record.description !== undefined &&
        (typeof record.description !== 'string' || !record.description.trim())) ||
      !arraysAreValid ||
      !groupsAreValid ||
      !validateExtra(record)
    ) {
      console.warn(`[seed] Skipping invalid ${label} record at position ${index + 1}.`)
      continue
    }

    valid.push(record)
  }

  return valid
}
