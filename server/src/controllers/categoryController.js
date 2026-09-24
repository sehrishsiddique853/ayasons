import {
  findActiveCategories,
  findActiveCategoryBySlug,
} from '../models/mysql/Category.js'


export const getCategories =
  async (
    req,
    res,
    next
  ) => {
    try {
      const categories =
        await findActiveCategories(
          req
        )


      res.status(200).json({
        success: true,
        count:
          categories.length,
        categories,
      })

    } catch (error) {
      next(error)
    }
  }


export const getCategoryBySlug =
  async (
    req,
    res,
    next
  ) => {
    try {
      const category =
        await findActiveCategoryBySlug(
          req.params.slug,
          req
        )


      if (!category) {
        res.status(404)

        throw new Error(
          'Category not found'
        )
      }


      res.status(200).json({
        success: true,
        category,
      })

    } catch (error) {
      next(error)
    }
  }