import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'

import {
  fileURLToPath,
} from 'node:url'

import {
  categoryImageFiles,
} from '../seed/seedData.js'


const __filename =
  fileURLToPath(
    import.meta.url
  )

const __dirname =
  path.dirname(
    __filename
  )


const copySeedImages =
  async () => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Source
      |--------------------------------------------------------------------------
      |
      | AYOSONS/client/src/assets/images
      |
      */

      const sourceDirectory =
        path.resolve(
          __dirname,
          '../../../client/src/assets/images'
        )


      /*
      |--------------------------------------------------------------------------
      | Destination
      |--------------------------------------------------------------------------
      |
      | AYOSONS/server/uploads/categories
      |
      */

      const destinationDirectory =
        path.resolve(
          __dirname,
          '../../uploads/categories'
        )


      await fs.mkdir(
        destinationDirectory,
        {
          recursive: true,
        }
      )


      const uniqueFiles = [
        ...new Set(
          Object.values(
            categoryImageFiles
          )
        ),
      ]


      console.log(
        'Copying category images...'
      )


      for (
        const fileName
        of uniqueFiles
      ) {
        const sourcePath =
          path.join(
            sourceDirectory,
            fileName
          )


        const destinationPath =
          path.join(
            destinationDirectory,
            fileName
          )


        await fs.copyFile(
          sourcePath,
          destinationPath
        )


        console.log(
          `✓ ${fileName}`
        )
      }


      console.log(
        '\nCategory images copied successfully.'
      )


      console.log(
        `Destination: ${destinationDirectory}`
      )

    } catch (error) {
      console.error(
        '\nImage copy failed:'
      )

      console.error(
        error.message
      )

      process.exitCode = 1
    }
  }


copySeedImages()