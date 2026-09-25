import {
  useEffect,
  useState,
} from 'react'

import {
  ImagePlus,
  Save,
  Upload,
} from 'lucide-react'

import api from '../services/api'

import '../styles/departments.css'


function Departments() {

  const [
    departments,
    setDepartments,
  ] = useState([])


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    savingId,
    setSavingId,
  ] = useState(null)


  const [
    uploadingId,
    setUploadingId,
  ] = useState(null)


  const [
    error,
    setError,
  ] = useState('')


  const [
    success,
    setSuccess,
  ] = useState('')


  useEffect(() => {

    let active = true


    const loadDepartments =
      async () => {

        try {

          setLoading(true)
          setError('')


          const response =
            await api.get(
              '/admin/departments'
            )


          if (!active) {
            return
          }


          setDepartments(
            response.data.departments ||
            []
          )

        } catch (error) {

          console.error(
            'Departments load error:',
            error
          )


          if (active) {

            setError(
              error.response
                ?.data
                ?.message ||
              'Unable to load departments.'
            )

          }

        } finally {

          if (active) {
            setLoading(false)
          }

        }

      }


    loadDepartments()


    return () => {
      active = false
    }

  }, [])


  const updateDepartment =
    (
      index,
      field,
      value
    ) => {

      setDepartments(
        (current) =>
          current.map(
            (
              department,
              departmentIndex
            ) =>
              departmentIndex ===
              index
                ? {
                    ...department,
                    [field]: value,
                  }
                : department
          )
      )


      setSuccess('')
    }


  const saveDepartment =
    async (
      department
    ) => {

      try {

        setSavingId(
          department.id
        )

        setError('')
        setSuccess('')


        await api.put(
          `/admin/departments/${department.id}`,
          {
            number:
              department.number,

            title:
              department.title,

            description:
              department.description,
          }
        )


        setSuccess(
          `${department.title} updated successfully.`
        )

      } catch (error) {

        console.error(
          'Department save error:',
          error
        )


        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to update department.'
        )

      } finally {

        setSavingId(
          null
        )

      }

    }


  const uploadImage =
    async (
      departmentId,
      file
    ) => {

      if (!file) {
        return
      }


      if (
        file.size >
        5 * 1024 * 1024
      ) {

        setError(
          'Department image must be 5 MB or smaller.'
        )

        return
      }


      try {

        setUploadingId(
          departmentId
        )

        setError('')
        setSuccess('')


        const data =
          new FormData()


        data.append(
          'image',
          file
        )


        const response =
          await api.put(
            `/admin/departments/${departmentId}/image`,
            data
          )


        setDepartments(
          (current) =>
            current.map(
              (department) =>
                department.id ===
                departmentId
                  ? {
                      ...department,

                      image: {
                        available:
                          true,

                        name:
                          file.name,

                        url:
                          `${
                            response
                              .data
                              .image
                              .url
                          }?v=${Date.now()}`,
                      },
                    }
                  : department
            )
        )


        setSuccess(
          'Department image updated successfully.'
        )

      } catch (error) {

        console.error(
          'Department image upload error:',
          error
        )


        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to upload department image.'
        )

      } finally {

        setUploadingId(
          null
        )

      }

    }


  if (loading) {

    return (
      <div className="departments-admin-state">
        Loading departments...
      </div>
    )

  }


  return (
    <div className="departments-admin-page">

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            WEBSITE
          </span>

          <h1>
            Departments
          </h1>

          <p>
            Manage department card
            images, numbers, titles and
            descriptions shown on the
            AYOSONS homepage.
          </p>

        </div>

      </div>


      {error && (

        <div className="departments-admin-error">
          {error}
        </div>

      )}


      {success && (

        <div className="departments-admin-success">
          {success}
        </div>

      )}


      <section className="departments-admin-grid">

        {departments.map(
          (
            department,
            index
          ) => (

            <article
              className="departments-admin-card"
              key={
                department.id
              }
            >

              <div className="departments-admin-image">

                {department
                  .image
                  ?.available &&
                department
                  .image
                  ?.url ? (

                  <img
                    src={
                      department
                        .image
                        .url
                    }
                    alt={
                      department.title
                    }
                  />

                ) : (

                  <div className="departments-admin-image-empty">

                    <ImagePlus
                      size={40}
                    />

                    <strong>
                      Add Image
                    </strong>

                  </div>

                )}


                <span className="departments-admin-number">
                  {
                    department.number
                  }
                </span>

              </div>


              <div className="departments-admin-card-body">

                <div className="departments-admin-card-heading">

                  <strong>
                    Department
                    {' '}
                    {index + 1}
                  </strong>


                  <label className="departments-admin-upload">

                    <Upload
                      size={15}
                    />

                    {
                      uploadingId ===
                      department.id
                        ? 'Uploading...'
                        : department
                            .image
                            ?.available
                          ? 'Replace Image'
                          : 'Upload Image'
                    }


                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={
                        uploadingId ===
                        department.id
                      }
                      onChange={
                        (event) => {

                          const file =
                            event
                              .target
                              .files?.[0]


                          uploadImage(
                            department.id,
                            file
                          )


                          event
                            .target
                            .value =
                            ''

                        }
                      }
                    />

                  </label>

                </div>


                <div className="departments-admin-fields">

                  <label>

                    <span>
                      Number
                    </span>

                    <input
                      value={
                        department.number
                      }
                      onChange={
                        (event) =>
                          updateDepartment(
                            index,
                            'number',
                            event
                              .target
                              .value
                          )
                      }
                    />

                  </label>


                  <label>

                    <span>
                      Title
                    </span>

                    <input
                      value={
                        department.title
                      }
                      onChange={
                        (event) =>
                          updateDepartment(
                            index,
                            'title',
                            event
                              .target
                              .value
                          )
                      }
                    />

                  </label>


                  <label className="departments-admin-description">

                    <span>
                      Description
                    </span>

                    <textarea
                      rows="5"
                      value={
                        department
                          .description
                      }
                      onChange={
                        (event) =>
                          updateDepartment(
                            index,
                            'description',
                            event
                              .target
                              .value
                          )
                      }
                    />

                  </label>

                </div>


                <button
                  type="button"
                  className="departments-admin-save"
                  disabled={
                    savingId ===
                    department.id
                  }
                  onClick={
                    () =>
                      saveDepartment(
                        department
                      )
                  }
                >

                  <Save
                    size={16}
                  />

                  {
                    savingId ===
                    department.id
                      ? 'Saving...'
                      : 'Save Department'
                  }

                </button>

              </div>

            </article>

          )
        )}

      </section>

    </div>
  )
}


export default Departments