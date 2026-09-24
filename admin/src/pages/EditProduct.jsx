import { useParams } from 'react-router-dom'

import ProductForm from '../components/catalog/ProductForm'

function EditProduct() {
  const { id } = useParams()

  return (
    <ProductForm
      mode="edit"
      productId={id}
    />
  )
}

export default EditProduct
