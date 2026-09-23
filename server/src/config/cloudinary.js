import { v2 as cloudinary } from 'cloudinary'

console.log('Cloudinary config check:', {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKeyPresent: Boolean(
    process.env.CLOUDINARY_API_KEY
  ),
  apiSecretPresent: Boolean(
    process.env.CLOUDINARY_API_SECRET
  ),
})

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,

  secure: true,
})

export default cloudinary