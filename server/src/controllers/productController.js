
import mongoose from 'mongoose'

import Product from '../models/Product.js'
import Category from '../models/Category.js'


/*
|--------------------------------------------------------------------------
| GET /api/products
|--------------------------------------------------------------------------
|
| Public product listing.
|
| Examples:
|
| /api/products
| /api/products?featured=true
|
*/

export const getProducts = async (
  req,
  res,
  next
) => {
  try {
    const filter = {
      active: true,
    }


    /*
    |--------------------------------------------------------------------------
    | Featured Filter
    |--------------------------------------------------------------------------
    */

    if (
      req.query.featured === 'true'
    ) {
      filter.featured = true
    }


    const products = await Product.find(
      filter
    )
      .populate(
        'category',
        'name slug'
      )
      .sort({
        order: 1,
        createdAt: 1,
      })
      .select('-__v')


    res.status(200).json({
      success: true,
      count: products.length,
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

export const getProductById = async (
  req,
  res,
  next
) => {
  try {

    if (
      !mongoose.isValidObjectId(
        req.params.id
      )
    ) {
      res.status(400)

      throw new Error(
        'Invalid product ID'
      )
    }


    const product =
      await Product.findOne({
        _id: req.params.id,
        active: true,
      })
        .populate(
          'category',
          'name slug'
        )
        .select('-__v')


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
|
| Example:
|
| /api/products/category/activewear
|
*/

export const getProductsByCategory =
  async (
    req,
    res,
    next
  ) => {
    try {

      const category =
        await Category.findOne({
          slug:
            req.params.slug.toLowerCase(),

          active: true,
        }).select(
          'name slug groups active'
        )


      if (!category) {
        res.status(404)

        throw new Error(
          'Category not found'
        )
      }


      const products =
        await Product.find({
          category: category._id,
          active: true,
        })
          .populate(
            'category',
            'name slug'
          )
          .sort({
            order: 1,
            createdAt: 1,
          })
          .select('-__v')


      res.status(200).json({
        success: true,

        category: {
          id: category._id,
          name: category.name,
          slug: category.slug,
          groups: category.groups,
        },

        count: products.length,

        products,
      })

    } catch (error) {
      next(error)
    }
  }