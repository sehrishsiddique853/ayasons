import {
  useEffect,
  useState,
} from 'react'

import api from '../services/api'

import DepartmentSection
  from '../components/home/DepartmentsSection'

import ManufacturingExcellence
  from '../components/home/ManufacturingExcellence'

import ManufacturingIntroSection
  from '../components/manufacturing/ManufacturingIntroSection'

import Footer
  from '../components/home/Footer'


function Manufacturing() {

  const [
    homepageContent,
    setHomepageContent,
  ] = useState(null)


  const [
    departments,
    setDepartments,
  ] = useState([])


  const [
    failed,
    setFailed,
  ] = useState(false)


  useEffect(() => {

    const controller =
      new AbortController()


    const loadPage =
      async () => {

        try {

          setFailed(false)


          const [
            homepageResponse,
            departmentsResponse,
          ] =
            await Promise.all([

              api.get(
                '/home-content',
                {
                  signal:
                    controller.signal,
                }
              ),

              api.get(
                '/departments',
                {
                  signal:
                    controller.signal,
                }
              ),

            ])


          if (
            controller.signal.aborted
          ) {
            return
          }


          const homeContent =
            homepageResponse
              .data
              .content ||
            null


          const departmentData =
            departmentsResponse
              .data
              .departments ||
            []


          setHomepageContent(
            homeContent
          )

          setDepartments(
            departmentData
          )

        } catch (error) {

          if (
            error.code ===
            'ERR_CANCELED'
          ) {
            return
          }


          console.error(
            'Manufacturing page error:',
            error
          )


          setFailed(true)

        }

      }


    loadPage()


    return () => {
      controller.abort()
    }

  }, [])


  /*
  |--------------------------------------------------------------------------
  | Actual Failure Only
  |--------------------------------------------------------------------------
  */

  if (failed) {

    return (

      <>

        <div className="manufacturing-page-error">
          Manufacturing information
          could not be loaded.
        </div>

        <Footer />

      </>

    )

  }


  return (

    <>

      <ManufacturingIntroSection
        homepageContent={
          homepageContent
        }
      />

      <ManufacturingExcellence
        homepageContent={
          homepageContent
        }
        priority
      />

      <DepartmentSection
        homepageContent={
          homepageContent
        }
        departments={
          departments
        }
      />


     


      <Footer />

    </>

  )

}


export default Manufacturing
