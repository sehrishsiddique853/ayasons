import {
  findActiveProducts,
  findActiveProductById,
  findActiveProductsByCategory,
} from '../models/mysql/Product.js'


/*
|--------------------------------------------------------------------------
| GET /api/products
|--------------------------------------------------------------------------
|
| Examples:
|
| /api/products
| /api/products?featured=true
|
*/

export const getProducts =
  async (
    req,
    res,
    next
  ) => {
    try {
      const featured =
        req.query.featured ===
        'true'


      const products =
        await findActiveProducts(
          req,
          {
            featured,
          }
        )


      res.status(200).json({
        success: true,

        count:
          products.length,

        products,
      })

    } catch (error) {
      next(error)
    }
  }


/*
|--------------------------------------------------------------------------
| GET /api/products/:id
|--------------------------------------------------------------------------
*/

export const getProductById =
  async (
    req,
    res,
    next
  ) => {
    try {
      const id =
        Number(req.params.id)


      /*
      |--------------------------------------------------------------------------
      | MySQL Uses Numeric IDs
      |--------------------------------------------------------------------------
      */

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        res.status(400)

        throw new Error(
          'Invalid product ID'
        )
      }


      const product =
        await findActiveProductById(
          id,
          req
        )


      if (!product) {
        res.status(404)

        throw new Error(
          'Product not found'
        )
      }


      res.status(200).json({
        success: true,
        product,
      })

    } catch (error) {
      next(error)
    }
  }


/*
|--------------------------------------------------------------------------
| GET /api/products/category/:slug
|--------------------------------------------------------------------------
*/

export const getProductsByCategory =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await findActiveProductsByCategory(
          req.params.slug,
          req
        )


      if (!result) {
        res.status(404)

        throw new Error(
          'Category not found'
        )
      }


      res.status(200).json({
        success: true,

        category:
          result.category,

        count:
          result.products.length,

        products:
          result.products,
      })

    } catch (error) {
      next(error)
    }
  }