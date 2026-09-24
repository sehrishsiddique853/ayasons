import { useParams } from 'react-router-dom'

import CategoryForm from '../components/catalog/CategoryForm'

function EditCategory() {
  const { id } = useParams()

  return (
    <CategoryForm
      mode="edit"
      categoryId={id}
    />
  )
}

export default EditCategory
