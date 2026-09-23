import Category from '../models/Category.js'


/*
|--------------------------------------------------------------------------
| GET /api/categories
|--------------------------------------------------------------------------
| Return all active categories for the public website.
*/

export const getCategories = async (
  req,
  res,
  next
) => {
  try {
    const categories = await Category.find({
      active: true,
    })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .select('-__v')

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    next(error)
  }
}


/*
|--------------------------------------------------------------------------
| GET /api/categories/:slug
|--------------------------------------------------------------------------
| Return one active category by slug.
*/

export const getCategoryBySlug = async (
  req,
  res,
  next
) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug.toLowerCase(),
      active: true,
    }).select('-__v')

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