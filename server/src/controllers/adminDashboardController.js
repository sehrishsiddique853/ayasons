import pool from '../config/mysql.js'


export const getAdminDashboard =
  async (
    req,
    res,
    next
  ) => {
    try {

      const [
        categoriesResult,
        productsResult,
        featuredResult,
        activeProductsResult,
      ] = await Promise.all([

        pool.execute(`
          SELECT COUNT(*) AS total
          FROM categories
        `),

        pool.execute(`
          SELECT COUNT(*) AS total
          FROM products
        `),

        pool.execute(`
          SELECT COUNT(*) AS total
          FROM products
          WHERE featured = 1
        `),

        pool.execute(`
          SELECT COUNT(*) AS total
          FROM products
          WHERE active = 1
        `),

      ])


      const totalCategories =
        Number(
          categoriesResult[0][0].total
        )


      const totalProducts =
        Number(
          productsResult[0][0].total
        )


      const featuredProducts =
        Number(
          featuredResult[0][0].total
        )


      const activeProducts =
        Number(
          activeProductsResult[0][0].total
        )


      res.status(200).json({
        success: true,

        stats: {
          totalCategories,
          totalProducts,
          featuredProducts,
          activeProducts,
        },
      })

    } catch (error) {
      next(error)
    }
  }