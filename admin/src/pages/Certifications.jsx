import {
  useEffect,
  useState,
} from 'react'

import {
  Award,
  ExternalLink,
  FileText,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react'

import api from '../services/api'

import '../styles/certifications.css'


function Certifications() {

  const [
    sectionContent,
    setSectionContent,
  ] = useState({
    kicker: '',
    heading: '',
    footerText: '',
  })


  const [
    standards,
    setStandards,
  ] = useState([])


  const [
    newCard,
    setNewCard,
  ] = useState({
    title: '',
    description: '',
  })


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    savingContent,
    setSavingContent,
  ] = useState(false)


  const [
    creating,
    setCreating,
  ] = useState(false)


  const [
    savingId,
    setSavingId,
  ] = useState(null)


  const [
    uploadingLogoId,
    setUploadingLogoId,
  ] = useState(null)


  const [
    uploadingCertificateId,
    setUploadingCertificateId,
  ] = useState(null)


  const [
    deletingId,
    setDeletingId,
  ] = useState(null)


  const [
    error,
    setError,
  ] = useState('')


  const [
    success,
    setSuccess,
  ] = useState('')


  const loadStandards =
    async () => {

      try {

        setLoading(true)
        setError('')


        const response =
          await api.get(
            '/admin/standards'
          )


        setSectionContent(
          response.data.content || {
            kicker: '',
            heading: '',
            footerText: '',
          }
        )


        setStandards(
          response.data.standards ||
          []
        )

      } catch (error) {

        console.error(
          'Certifications load error:',
          error
        )


        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to load certifications.'
        )

      } finally {

        setLoading(false)

      }

    }


  useEffect(() => {

    loadStandards()

  }, [])


  const updateSection =
    (
      field,
      value
    ) => {

      setSectionContent(
        (current) => ({
          ...current,
          [field]: value,
        })
      )


      setSuccess('')
    }


  const updateStandard =
    (
      index,
      field,
      value
    ) => {

      setStandards(
        (current) =>
          current.map(
            (
              standard,
              standardIndex
            ) =>
              standardIndex === index
                ? {
                    ...standard,
                    [field]: value,
                  }
                : standard
          )
      )


      setSuccess('')
    }


  const saveSectionContent =
    async () => {

      try {

        setSavingContent(true)
        setError('')
        setSuccess('')


        await api.put(
          '/admin/standards/content',
          sectionContent
        )


        setSuccess(
          'Certification section content updated successfully.'
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to update certification section.'
        )

      } finally {

        setSavingContent(false)

      }

    }


  const createStandard =
    async (
      event
    ) => {

      event.preventDefault()


      try {

        setCreating(true)
        setError('')
        setSuccess('')


        const response =
          await api.post(
            '/admin/standards',
            newCard
          )


        setStandards(
          (current) => [
            ...current,
            response.data.standard,
          ]
        )


        setNewCard({
          title: '',
          description: '',
        })


        setSuccess(
          'Certification card added successfully.'
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to create certification.'
        )

      } finally {

        setCreating(false)

      }

    }


  const saveStandard =
    async (
      standard
    ) => {

      try {

        setSavingId(
          standard.id
        )

        setError('')
        setSuccess('')


        await api.put(
          `/admin/standards/${standard.id}`,
          {
            title:
              standard.title,

            description:
              standard.description,
          }
        )


        setSuccess(
          `${standard.title} updated successfully.`
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to update certification.'
        )

      } finally {

        setSavingId(
          null
        )

      }

    }


  const uploadLogo =
    async (
      standardId,
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
          'Logo image must be 5 MB or smaller.'
        )

        return
      }


      try {

        setUploadingLogoId(
          standardId
        )

        setError('')
        setSuccess('')


        const data =
          new FormData()


        data.append(
          'logo',
          file
        )


        const response =
          await api.put(
            `/admin/standards/${standardId}/logo`,
            data
          )


        setStandards(
          (current) =>
            current.map(
              (standard) =>
                standard.id ===
                standardId
                  ? {
                      ...standard,

                      logo: {
                        ...response
                          .data
                          .logo,

                        url:
                          `${
                            response
                              .data
                              .logo
                              .url
                          }?v=${Date.now()}`,
                      },
                    }
                  : standard
            )
        )


        setSuccess(
          'Certification logo updated successfully.'
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to upload logo.'
        )

      } finally {

        setUploadingLogoId(
          null
        )

      }

    }


  const uploadCertificate =
    async (
      standardId,
      file
    ) => {

      if (!file) {
        return
      }


      if (
        file.size >
        10 * 1024 * 1024
      ) {

        setError(
          'Certificate file must be 10 MB or smaller.'
        )

        return
      }


      try {

        setUploadingCertificateId(
          standardId
        )

        setError('')
        setSuccess('')


        const data =
          new FormData()


        data.append(
          'certificate',
          file
        )


        const response =
          await api.put(
            `/admin/standards/${standardId}/certificate`,
            data
          )


        setStandards(
          (current) =>
            current.map(
              (standard) =>
                standard.id ===
                standardId
                  ? {
                      ...standard,

                      certificate: {
                        ...response
                          .data
                          .certificate,

                        url:
                          `${
                            response
                              .data
                              .certificate
                              .url
                          }?v=${Date.now()}`,
                      },
                    }
                  : standard
            )
        )


        setSuccess(
          'Certificate file uploaded successfully.'
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to upload certificate.'
        )

      } finally {

        setUploadingCertificateId(
          null
        )

      }

    }


  const deleteStandard =
    async (
      standard
    ) => {

      const confirmed =
        window.confirm(
          `Delete "${standard.title}"?`
        )


      if (!confirmed) {
        return
      }


      try {

        setDeletingId(
          standard.id
        )

        setError('')
        setSuccess('')


        await api.delete(
          `/admin/standards/${standard.id}`
        )


        setStandards(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                standard.id
            )
        )


        setSuccess(
          'Certification card deleted successfully.'
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to delete certification.'
        )

      } finally {

        setDeletingId(
          null
        )

      }

    }


  if (loading) {

    return (
      <div className="certifications-state">
        Loading certifications...
      </div>
    )

  }


  return (
    <div className="certifications-page">

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            WEBSITE
          </span>

          <h1>
            Certifications
          </h1>

          <p>
            Manage certification cards,
            logo images and certificate
            documents shown on the
            AYOSONS website.
          </p>

        </div>

      </div>


      {error && (

        <div className="certifications-error">
          {error}
        </div>

      )}


      {success && (

        <div className="certifications-success">
          {success}
        </div>

      )}


      {/* SECTION CONTENT */}

      <section className="certifications-panel">

        <div className="certifications-panel-header">

          <div>

            <h2>
              Section Content
            </h2>

            <p>
              Manage the text surrounding
              the certification cards.
            </p>

          </div>


          <button
            type="button"
            className="certifications-primary-button"
            disabled={
              savingContent
            }
            onClick={
              saveSectionContent
            }
          >

            <Save size={16} />

            {savingContent
              ? 'Saving...'
              : 'Save Content'}

          </button>

        </div>


        <div className="certifications-section-fields">

          <label>

            <span>
              Small Heading
            </span>

            <input
              value={
                sectionContent.kicker
              }
              onChange={
                (event) =>
                  updateSection(
                    'kicker',
                    event.target.value
                  )
              }
            />

          </label>


          <label>

            <span>
              Main Heading
            </span>

            <input
              value={
                sectionContent.heading
              }
              onChange={
                (event) =>
                  updateSection(
                    'heading',
                    event.target.value
                  )
              }
            />

          </label>


          <label className="certifications-full-field">

            <span>
              Footer Paragraph
            </span>

            <textarea
              rows="4"
              value={
                sectionContent.footerText
              }
              onChange={
                (event) =>
                  updateSection(
                    'footerText',
                    event.target.value
                  )
              }
            />

          </label>

        </div>

      </section>


      {/* ADD NEW CARD */}

      <section className="certifications-panel">

        <div className="certifications-panel-header">

          <div>

            <h2>
              Add Certification
            </h2>

            <p>
              Create another card in the
              certification section.
            </p>

          </div>

        </div>


        <form
          className="certifications-add-form"
          onSubmit={
            createStandard
          }
        >

          <label>

            <span>
              Title
            </span>

            <input
              value={
                newCard.title
              }
              onChange={
                (event) =>
                  setNewCard(
                    (current) => ({
                      ...current,
                      title:
                        event
                          .target
                          .value,
                    })
                  )
              }
              placeholder="Certificate title"
              required
            />

          </label>


          <label>

            <span>
              Description
            </span>

            <input
              value={
                newCard.description
              }
              onChange={
                (event) =>
                  setNewCard(
                    (current) => ({
                      ...current,
                      description:
                        event
                          .target
                          .value,
                    })
                  )
              }
              placeholder="Short description"
              required
            />

          </label>


          <button
            type="submit"
            className="certifications-primary-button"
            disabled={
              creating
            }
          >

            <Plus size={17} />

            {creating
              ? 'Adding...'
              : 'Add Certification'}

          </button>

        </form>

      </section>


      {/* CARDS */}

      <div className="certifications-admin-grid">

        {standards.map(
          (
            standard,
            index
          ) => (

            <article
              className="certifications-admin-card"
              key={
                standard.id
              }
            >

              <div className="certifications-logo-preview">

                {standard
                  .logo
                  ?.available &&
                standard
                  .logo
                  ?.url ? (

                  <img
                    src={
                      standard
                        .logo
                        .url
                    }
                    alt={
                      standard.title
                    }
                  />

                ) : (

                  <div className="certifications-logo-empty">

                    <ImagePlus
                      size={38}
                    />

                    <strong>
                      Add Image
                    </strong>

                  </div>

                )}


                <span className="certifications-card-position">
                  {
                    String(
                      index + 1
                    ).padStart(
                      2,
                      '0'
                    )
                  }
                </span>

              </div>


              <div className="certifications-admin-body">

                <div className="certifications-card-toolbar">

                  <strong>
                    Certification
                    {' '}
                    {index + 1}
                  </strong>


                  <button
                    type="button"
                    className="certifications-delete"
                    disabled={
                      deletingId ===
                      standard.id
                    }
                    onClick={
                      () =>
                        deleteStandard(
                          standard
                        )
                    }
                  >

                    <Trash2
                      size={15}
                    />

                  </button>

                </div>


                <div className="certifications-media-actions">

                  <label className="certifications-upload">

                    <Upload
                      size={15}
                    />

                    {
                      uploadingLogoId ===
                      standard.id
                        ? 'Uploading...'
                        : standard
                            .logo
                            ?.available
                          ? 'Replace Logo'
                          : 'Upload Logo'
                    }


                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={
                        uploadingLogoId ===
                        standard.id
                      }
                      onChange={
                        (event) => {

                          const file =
                            event
                              .target
                              .files?.[0]


                          uploadLogo(
                            standard.id,
                            file
                          )


                          event.target.value =
                            ''

                        }
                      }
                    />

                  </label>


                  <label className="certifications-upload">

                    <FileText
                      size={15}
                    />

                    {
                      uploadingCertificateId ===
                      standard.id
                        ? 'Uploading...'
                        : standard
                            .certificate
                            ?.available
                          ? 'Replace Certificate'
                          : 'Upload Certificate'
                    }


                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      disabled={
                        uploadingCertificateId ===
                        standard.id
                      }
                      onChange={
                        (event) => {

                          const file =
                            event
                              .target
                              .files?.[0]


                          uploadCertificate(
                            standard.id,
                            file
                          )


                          event.target.value =
                            ''

                        }
                      }
                    />

                  </label>

                </div>


                {standard
                  .certificate
                  ?.available &&
                standard
                  .certificate
                  ?.url && (

                  <a
                    className="certifications-open-certificate"
                    href={
                      standard
                        .certificate
                        .url
                    }
                    target="_blank"
                    rel="noreferrer"
                  >

                    <ExternalLink
                      size={14}
                    />

                    Open Certificate

                  </a>

                )}


                <div className="certifications-fields">

                  <label>

                    <span>
                      Title
                    </span>

                    <input
                      value={
                        standard.title
                      }
                      onChange={
                        (event) =>
                          updateStandard(
                            index,
                            'title',
                            event
                              .target
                              .value
                          )
                      }
                    />

                  </label>


                  <label>

                    <span>
                      Description
                    </span>

                    <textarea
                      rows="4"
                      value={
                        standard
                          .description
                      }
                      onChange={
                        (event) =>
                          updateStandard(
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
                  className="certifications-save-card"
                  disabled={
                    savingId ===
                    standard.id
                  }
                  onClick={
                    () =>
                      saveStandard(
                        standard
                      )
                  }
                >

                  <Save size={16} />

                  {savingId ===
                  standard.id
                    ? 'Saving...'
                    : 'Save Card'}

                </button>

              </div>

            </article>

          )
        )}

      </div>

    </div>
  )
}


export default Certifications