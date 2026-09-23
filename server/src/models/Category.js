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

const categoryGroupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    items: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },
  },
  {
    _id: true,
  }
)

const categorySchema = new mongoose.Schema(
  {
    /**
     * Basic Information
     */

    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [
        100,
        'Category name cannot exceed 100 characters',
      ],
    },

    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [
        120,
        'Category slug cannot exceed 120 characters',
      ],
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers and hyphens',
      ],
    },

    /**
     * Hero Content
     */

    eyebrow: {
      type: String,
      trim: true,
      default: '',
    },

    showcaseLabel: {
  type: String,
  trim: true,
  default: '',
  maxlength: [
    100,
    'Showcase label cannot exceed 100 characters',
  ],
},

    heroTitle: {
      type: String,
      required: [true, 'Hero title is required'],
      trim: true,
      maxlength: [
        180,
        'Hero title cannot exceed 180 characters',
      ],
    },

    collectionDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [
        1000,
        'Collection description cannot exceed 1000 characters',
      ],
    },

    /**
     * Images
     */

    heroImage: {
      type: imageSchema,
      default: () => ({
        url: '',
        publicId: '',
      }),
    },

    collectionImage: {
      type: imageSchema,
      default: () => ({
        url: '',
        publicId: '',
      }),
    },

    /**
     * Collection Groups
     */

    groups: {
      type: [categoryGroupSchema],
      default: [],
    },

    /**
     * Visibility / Order
     */

    active: {
      type: Boolean,
      default: true,
    },

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

/**
 * Indexes
 */

categorySchema.index({
  active: 1,
  order: 1,
})

/**
 * JSON Output
 */

categorySchema.set('toJSON', {
  virtuals: true,
})

categorySchema.set('toObject', {
  virtuals: true,
})

const Category =
  mongoose.models.Category ||
  mongoose.model('Category', categorySchema)

export default Category