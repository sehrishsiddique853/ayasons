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

import '../styles/our-process.css'


function OurProcess() {

  const [
    process,
    setProcess,
  ] = useState({
    kicker: '',
    headingLine1: '',
    headingLine2: '',
    intro: '',
    steps: [],
  })


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    saving,
    setSaving,
  ] = useState(false)


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


    const loadProcess =
      async () => {

        try {

          setLoading(true)
          setError('')


          const response =
            await api.get(
              '/admin/home-content/process'
            )


          if (!active) {
            return
          }


          setProcess(
            response.data.process
          )

        } catch (error) {

          console.error(
            'Process load error:',
            error
          )


          if (active) {

            setError(
              error.response
                ?.data
                ?.message ||
              'Unable to load process section.'
            )

          }

        } finally {

          if (active) {
            setLoading(false)
          }

        }

      }


    loadProcess()


    return () => {
      active = false
    }

  }, [])


  const updateHeader =
    (
      field,
      value
    ) => {

      setProcess(
        (current) => ({
          ...current,
          [field]: value,
        })
      )


      setSuccess('')
    }


  const updateStep =
    (
      index,
      field,
      value
    ) => {

      setProcess(
        (current) => ({
          ...current,

          steps:
            current.steps.map(
              (
                step,
                stepIndex
              ) =>
                stepIndex === index
                  ? {
                      ...step,
                      [field]: value,
                    }
                  : step
            ),
        })
      )


      setSuccess('')
    }


  const saveProcess =
    async (
      event
    ) => {

      event.preventDefault()


      try {

        setSaving(true)
        setError('')
        setSuccess('')


        await api.put(
          '/admin/home-content/process',
          {
            kicker:
              process.kicker,

            headingLine1:
              process.headingLine1,

            headingLine2:
              process.headingLine2,

            intro:
              process.intro,

            steps:
              process.steps.map(
                (step) => ({
                  id:
                    step.id,

                  number:
                    step.number,

                  title:
                    step.title,

                  description:
                    step.description,
                })
              ),
          }
        )


        setSuccess(
          'Our Process section updated successfully.'
        )

      } catch (error) {

        console.error(
          'Process save error:',
          error
        )


        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to update process section.'
        )

      } finally {

        setSaving(false)

      }

    }


  const uploadStepImage =
    async (
      stepId,
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
          'Process image must be 5 MB or smaller.'
        )

        return
      }


      try {

        setUploadingId(
          stepId
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
            `/admin/home-content/process/${stepId}/image`,
            data
          )


        setProcess(
          (current) => ({
            ...current,

            steps:
              current.steps.map(
                (step) =>
                  step.id ===
                  stepId
                    ? {
                        ...step,

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
                    : step
              ),
          })
        )


        setSuccess(
          'Process card image updated successfully.'
        )

      } catch (error) {

        console.error(
          'Process image upload error:',
          error
        )


        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to update process image.'
        )

      } finally {

        setUploadingId(
          null
        )

      }

    }


  if (loading) {

    return (
      <div className="our-process-state">
        Loading Our Process...
      </div>
    )

  }


  return (
    <div className="our-process-page">

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            WEBSITE
          </span>

          <h1>
            Our Process
          </h1>

          <p>
            Manage the process section
            heading, description,
            production steps and card
            images.
          </p>

        </div>

      </div>


      {error && (

        <div className="our-process-error">
          {error}
        </div>

      )}


      {success && (

        <div className="our-process-success">
          {success}
        </div>

      )}


      <form
        onSubmit={
          saveProcess
        }
      >

        {/* SECTION HEADER */}

        <section className="our-process-panel">

          <div className="our-process-panel-header">

            <div>

              <span className="our-process-panel-number">
                01
              </span>

              <div>

                <h2>
                  Section Heading
                </h2>

                <p>
                  Control the heading
                  and introduction shown
                  above the cards.
                </p>

              </div>

            </div>

          </div>


          <div className="our-process-header-fields">

            <label>

              <span>
                Small Heading
              </span>

              <input
                value={
                  process.kicker
                }
                onChange={
                  (event) =>
                    updateHeader(
                      'kicker',
                      event
                        .target
                        .value
                    )
                }
                required
              />

            </label>


            <div className="our-process-heading-row">

              <label>

                <span>
                  Heading Line 1
                </span>

                <input
                  value={
                    process
                      .headingLine1
                  }
                  onChange={
                    (event) =>
                      updateHeader(
                        'headingLine1',
                        event
                          .target
                          .value
                      )
                  }
                  required
                />

              </label>


              <label>

                <span>
                  Heading Line 2
                </span>

                <input
                  value={
                    process
                      .headingLine2
                  }
                  onChange={
                    (event) =>
                      updateHeader(
                        'headingLine2',
                        event
                          .target
                          .value
                      )
                  }
                  required
                />

              </label>

            </div>


            <label>

              <span>
                Introduction Paragraph
              </span>

              <textarea
                rows="4"
                value={
                  process.intro
                }
                onChange={
                  (event) =>
                    updateHeader(
                      'intro',
                      event
                        .target
                        .value
                    )
                }
                required
              />

            </label>

          </div>

        </section>


        {/* PROCESS CARDS */}

        <section className="our-process-panel">

          <div className="our-process-panel-header">

            <div>

              <span className="our-process-panel-number">
                02
              </span>

              <div>

                <h2>
                  Process Cards
                </h2>

                <p>
                  Edit all seven
                  production steps and
                  replace their images.
                </p>

              </div>

            </div>

          </div>


          <div className="our-process-cards">

            {process.steps.map(
              (
                step,
                index
              ) => (

                <article
                  className="our-process-card"
                  key={
                    step.id
                  }
                >

                  <div className="our-process-image">

                    {step
                      .image
                      ?.available &&
                    step
                      .image
                      ?.url ? (

                      <img
                        src={
                          step
                            .image
                            .url
                        }
                        alt={
                          step.title
                        }
                      />

                    ) : (

                      <div className="our-process-image-empty">

                        <ImagePlus
                          size={32}
                        />

                        <span>
                          No image
                        </span>

                      </div>

                    )}


                    <span className="our-process-image-step">
                      {
                        step.number
                      }
                    </span>

                  </div>


                  <div className="our-process-card-body">

                    <div className="our-process-card-top">

                      <strong>
                        Process Step
                        {' '}
                        {
                          index + 1
                        }
                      </strong>


                      <label className="our-process-upload">

                        <Upload
                          size={15}
                        />

                        {uploadingId ===
                        step.id
                          ? 'Uploading...'
                          : step
                              .image
                              ?.available
                            ? 'Replace Image'
                            : 'Upload Image'}


                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={
                            uploadingId ===
                            step.id
                          }
                          onChange={
                            (event) => {

                              const file =
                                event
                                  .target
                                  .files
                                  ?.[0]


                              uploadStepImage(
                                step.id,
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


                    <div className="our-process-card-fields">

                      <label>

                        <span>
                          Number
                        </span>

                        <input
                          value={
                            step.number
                          }
                          onChange={
                            (event) =>
                              updateStep(
                                index,
                                'number',
                                event
                                  .target
                                  .value
                              )
                          }
                          required
                        />

                      </label>


                      <label>

                        <span>
                          Card Title
                        </span>

                        <input
                          value={
                            step.title
                          }
                          onChange={
                            (event) =>
                              updateStep(
                                index,
                                'title',
                                event
                                  .target
                                  .value
                              )
                          }
                          required
                        />

                      </label>


                      <label className="our-process-description-field">

                        <span>
                          Description
                        </span>

                        <textarea
                          rows="4"
                          value={
                            step
                              .description
                          }
                          onChange={
                            (event) =>
                              updateStep(
                                index,
                                'description',
                                event
                                  .target
                                  .value
                              )
                          }
                          required
                        />

                      </label>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        </section>


        <div className="our-process-actions">

          <button
            type="submit"
            className="our-process-save"
            disabled={
              saving ||
              uploadingId !== null
            }
          >

            <Save size={18} />

            {saving
              ? 'Saving...'
              : 'Save Process Content'}

          </button>

        </div>

      </form>

    </div>
  )
}


export default OurProcess