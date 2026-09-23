
import mongoose from 'mongoose'


const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      default: '',
      trim: true,
    },

    publicId: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    _id: false,
  }
)


const productSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Basic Information
    |--------------------------------------------------------------------------
    */

    name: {
      type: String,
      required: [
        true,
        'Product name is required',
      ],

      trim: true,

      maxlength: [
        150,
        'Product name cannot exceed 150 characters',
      ],
    },


    slug: {
      type: String,
      required: [
        true,
        'Product slug is required',
      ],

      trim: true,
      lowercase: true,

      maxlength: [
        180,
        'Product slug cannot exceed 180 characters',
      ],

      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers and hyphens',
      ],
    },


    /*
    |--------------------------------------------------------------------------
    | Category Relationship
    |--------------------------------------------------------------------------
    */

    category: {
      type: mongoose.Schema.Types.ObjectId,

      ref: 'Category',

      required: [
        true,
        'Product category is required',
      ],

      index: true,
    },


    /*
    |--------------------------------------------------------------------------
    | Optional Group
    |--------------------------------------------------------------------------
    |
    | Examples:
    |
    | Activewear:
    | group: "Men"
    | group: "Women"
    |
    | Sportswear:
    | group: "Sportswear Collection"
    |
    */

    group: {
      type: String,
      trim: true,
      default: '',
    },


    /*
    |--------------------------------------------------------------------------
    | Product Content
    |--------------------------------------------------------------------------
    */

    description: {
      type: String,

      required: [
        true,
        'Product description is required',
      ],

      trim: true,

      maxlength: [
        1500,
        'Product description cannot exceed 1500 characters',
      ],
    },


    /*
    |--------------------------------------------------------------------------
    | Product Image
    |--------------------------------------------------------------------------
    */

    image: {
      type: imageSchema,

      default: () => ({
        url: '',
        publicId: '',
      }),
    },


    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    |
    | Example:
    |
    | [
    |   "Custom Colors",
    |   "Custom Branding",
    |   "Custom Sizes"
    | ]
    |
    */

    features: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],

      default: [],
    },


    /*
    |--------------------------------------------------------------------------
    | Visibility
    |--------------------------------------------------------------------------
    */

    featured: {
      type: Boolean,
      default: false,
    },


    active: {
      type: Boolean,
      default: true,
    },


    /*
    |--------------------------------------------------------------------------
    | Display Order
    |--------------------------------------------------------------------------
    */

    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)


/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

/*
| Product slug only needs to be unique
| inside its own category.
|
| Example:
| /products/activewear/shorts
| /products/streetwear/shorts
|
| Both can exist.
*/

productSchema.index(
  {
    category: 1,
    slug: 1,
  },
  {
    unique: true,
  }
)


productSchema.index({
  category: 1,
  active: 1,
  order: 1,
})


productSchema.index({
  featured: 1,
  active: 1,
  order: 1,
})


/*
|--------------------------------------------------------------------------
| JSON Output
|--------------------------------------------------------------------------
*/

productSchema.set(
  'toJSON',
  {
    virtuals: true,
  }
)

productSchema.set(
  'toObject',
  {
    virtuals: true,
  }
)


const Product =
  mongoose.models.Product ||
  mongoose.model(
    'Product',
    productSchema
  )


export default Product