import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ImagePlus,
  Save,
  Upload,
  Video,
} from 'lucide-react'

import api from '../services/api'

import '../styles/home-content.css'


const API_BASE =
  (
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'
  ).replace(
    /\/+$/,
    ''
  )


function HomeContent() {

  const [
    manufacturingStats,
    setManufacturingStats,
  ] = useState([])


  const [
    departmentStats,
    setDepartmentStats,
  ] = useState([])


  const [
    aboutImage,
    setAboutImage,
  ] = useState(null)


  const [
    manufacturingVideo,
    setManufacturingVideo,
  ] = useState(null)


  const [
    hasAboutImage,
    setHasAboutImage,
  ] = useState(false)


  const [
    hasVideo,
    setHasVideo,
  ] = useState(false)


  const [
    currentAboutImageName,
    setCurrentAboutImageName,
  ] = useState('')


  const [
    currentVideoName,
    setCurrentVideoName,
  ] = useState('')


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    saving,
    setSaving,
  ] = useState(false)


  const [
    error,
    setError,
  ] = useState('')


  const [
    success,
    setSuccess,
  ] = useState('')


  const aboutPreview =
    useMemo(
      () => {

        if (aboutImage) {
          return URL.createObjectURL(
            aboutImage
          )
        }


        if (hasAboutImage) {
          return `${API_BASE}/home-content/about-image`
        }


        return ''

      },
      [
        aboutImage,
        hasAboutImage,
      ]
    )


  const videoPreview =
    useMemo(
      () => {

        if (manufacturingVideo) {
          return URL.createObjectURL(
            manufacturingVideo
          )
        }


        if (hasVideo) {
          return `${API_BASE}/home-content/manufacturing-video`
        }


        return ''

      },
      [
        manufacturingVideo,
        hasVideo,
      ]
    )


  useEffect(() => {

    let active = true


    const loadContent =
      async () => {

        try {

          setLoading(true)
          setError('')


          const response =
            await api.get(
              '/admin/home-content'
            )


          if (!active) {
            return
          }


          const content =
            response.data.content


          setManufacturingStats(
            content
              .manufacturingStats ||
            []
          )


          setDepartmentStats(
            content
              .departmentStats ||
            []
          )


          setHasAboutImage(
            Boolean(
              content
                .aboutImage
                ?.available
            )
          )


          setCurrentAboutImageName(
            content
              .aboutImage
              ?.name ||
            ''
          )


          setHasVideo(
            Boolean(
              content
                .manufacturingVideo
                ?.available
            )
          )


          setCurrentVideoName(
            content
              .manufacturingVideo
              ?.name ||
            ''
          )

        } catch (error) {

          console.error(
            'Home content load error:',
            error
          )


          if (active) {

            setError(
              error.response
                ?.data
                ?.message ||
              'Unable to load homepage content.'
            )

          }

        } finally {

          if (active) {
            setLoading(false)
          }

        }

      }


    loadContent()


    return () => {
      active = false
    }

  }, [])


  useEffect(() => {

    return () => {

      if (
        aboutImage &&
        aboutPreview
      ) {
        URL.revokeObjectURL(
          aboutPreview
        )
      }

    }

  }, [
    aboutImage,
    aboutPreview,
  ])


  useEffect(() => {

    return () => {

      if (
        manufacturingVideo &&
        videoPreview
      ) {
        URL.revokeObjectURL(
          videoPreview
        )
      }

    }

  }, [
    manufacturingVideo,
    videoPreview,
  ])


  const updateManufacturingStat =
    (
      index,
      field,
      value
    ) => {

      setManufacturingStats(
        (current) =>
          current.map(
            (
              stat,
              statIndex
            ) =>
              statIndex ===
              index
                ? {
                    ...stat,
                    [field]:
                      value,
                  }
                : stat
          )
      )


      setSuccess('')

    }


  const updateDepartmentStat =
    (
      index,
      field,
      value
    ) => {

      setDepartmentStats(
        (current) =>
          current.map(
            (
              stat,
              statIndex
            ) =>
              statIndex ===
              index
                ? {
                    ...stat,
                    [field]:
                      value,
                  }
                : stat
          )
      )


      setSuccess('')

    }


  const handleAboutImage =
    (
      event
    ) => {

      const file =
        event.target
          .files?.[0]


      if (!file) {
        return
      }


      if (
        file.size >
        5 * 1024 * 1024
      ) {

        setError(
          'About image must be 5 MB or smaller.'
        )

        event.target.value = ''

        return

      }


      setAboutImage(
        file
      )

      setError('')
      setSuccess('')

    }


  const handleVideo =
    (
      event
    ) => {

      const file =
        event.target
          .files?.[0]


      if (!file) {
        return
      }


      if (
        file.size >
        50 * 1024 * 1024
      ) {

        setError(
          'Manufacturing video must be 50 MB or smaller.'
        )

        event.target.value = ''

        return

      }


      setManufacturingVideo(
        file
      )

      setError('')
      setSuccess('')

    }


  const handleSubmit =
    async (
      event
    ) => {

      event.preventDefault()


      try {

        setSaving(true)
        setError('')
        setSuccess('')


        const data =
          new FormData()


        data.append(
          'manufacturingStats',
          JSON.stringify(
            manufacturingStats
          )
        )


        data.append(
          'departmentStats',
          JSON.stringify(
            departmentStats
          )
        )


        if (aboutImage) {

          data.append(
            'aboutImage',
            aboutImage
          )

        }


        if (
          manufacturingVideo
        ) {

          data.append(
            'manufacturingVideo',
            manufacturingVideo
          )

        }


        await api.put(
          '/admin/home-content',
          data
        )


        setSuccess(
          'Homepage content updated successfully.'
        )


        if (aboutImage) {

          setHasAboutImage(
            true
          )

          setCurrentAboutImageName(
            aboutImage.name
          )

          setAboutImage(
            null
          )

        }


        if (
          manufacturingVideo
        ) {

          setHasVideo(
            true
          )

          setCurrentVideoName(
            manufacturingVideo.name
          )

          setManufacturingVideo(
            null
          )

        }

      } catch (error) {

        console.error(
          'Homepage save error:',
          error
        )


        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to update homepage content.'
        )

      } finally {

        setSaving(false)

      }

    }


  if (loading) {

    return (
      <div className="home-content-state">
        Loading homepage content...
      </div>
    )

  }


  return (
    <div className="home-content-page">

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            WEBSITE
          </span>

          <h1>
            Home Content
          </h1>

          <p>
            Manage key images,
            manufacturing statistics,
            production video and
            department statistics shown
            on the AYOSONS homepage.
          </p>

        </div>

      </div>


      {error && (

        <div className="home-content-error">
          {error}
        </div>

      )}


      {success && (

        <div className="home-content-success">
          {success}
        </div>

      )}


      <form
        className="home-content-form"
        onSubmit={
          handleSubmit
        }
      >

        {/* ABOUT IMAGE */}

        <section className="home-content-card">

          <div className="home-content-card-header">

            <div>

              <span className="home-content-section-number">
                01
              </span>

              <div>

                <h2>
                  About Section Image
                </h2>

                <p>
                  Change the factory
                  image displayed beside
                  “From Sialkot To The
                  World”.
                </p>

              </div>

            </div>

          </div>


          <div className="home-media-layout">

            <div className="home-media-preview">

              {aboutPreview ? (

                <img
                  src={
                    aboutPreview
                  }
                  alt="About section preview"
                />

              ) : (

                <div className="home-media-empty">

                  <ImagePlus
                    size={34}
                  />

                  <span>
                    No image uploaded
                  </span>

                </div>

              )}

            </div>


            <div className="home-media-controls">

              <h3>
                Factory Image
              </h3>


              <p>
                Recommended: landscape
                image, JPG, PNG or WEBP.
                Maximum size 5 MB.
              </p>


              {currentAboutImageName && (

                <span className="home-current-file">
                  Current:
                  {' '}
                  {
                    currentAboutImageName
                  }
                </span>

              )}


              <label className="home-upload-button">

                <Upload size={17} />

                {hasAboutImage
                  ? 'Replace Image'
                  : 'Upload Image'}


                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleAboutImage
                  }
                />

              </label>


              {aboutImage && (

                <span className="home-new-file">
                  New:
                  {' '}
                  {
                    aboutImage.name
                  }
                </span>

              )}

            </div>

          </div>

        </section>


        {/* MANUFACTURING STATS */}

        <section className="home-content-card">

          <div className="home-content-card-header">

            <div>

              <span className="home-content-section-number">
                02
              </span>

              <div>

                <h2>
                  Manufacturing Statistics
                </h2>

                <p>
                  Update the three figures
                  shown in the
                  Manufacturing
                  Excellence section.
                </p>

              </div>

            </div>

          </div>


          <div className="home-stats-grid home-stats-grid--three">

            {manufacturingStats.map(
              (
                stat,
                index
              ) => (

                <div
                  className="home-stat-editor"
                  key={
                    index
                  }
                >

                  <span className="home-stat-position">
                    Stat {
                      index + 1
                    }
                  </span>


                  <label>

                    <span>
                      Value
                    </span>

                    <input
                      value={
                        stat.value
                      }
                      onChange={
                        (
                          event
                        ) =>
                          updateManufacturingStat(
                            index,
                            'value',
                            event
                              .target
                              .value
                          )
                      }
                      placeholder="10+"
                      required
                    />

                  </label>


                  <label>

                    <span>
                      Label
                    </span>

                    <input
                      value={
                        stat.label
                      }
                      onChange={
                        (
                          event
                        ) =>
                          updateManufacturingStat(
                            index,
                            'label',
                            event
                              .target
                              .value
                          )
                      }
                      placeholder="Years Experience"
                      required
                    />

                  </label>

                </div>

              )
            )}

          </div>

        </section>


        {/* VIDEO */}

        <section className="home-content-card">

          <div className="home-content-card-header">

            <div>

              <span className="home-content-section-number">
                03
              </span>

              <div>

                <h2>
                  Manufacturing Video
                </h2>

                <p>
                  Upload the real
                  manufacturing video
                  shown inside the
                  AYOSONS production
                  section.
                </p>

              </div>

            </div>

          </div>


          <div className="home-media-layout">

            <div className="home-media-preview home-video-preview">

              {videoPreview ? (

                <video
                  src={
                    videoPreview
                  }
                  controls
                  preload="metadata"
                />

              ) : (

                <div className="home-media-empty">

                  <Video
                    size={36}
                  />

                  <span>
                    No manufacturing
                    video uploaded
                  </span>

                </div>

              )}

            </div>


            <div className="home-media-controls">

              <h3>
                Production Video
              </h3>


              <p>
                Upload MP4 or WEBM.
                Maximum file size
                50 MB.
              </p>


              {currentVideoName && (

                <span className="home-current-file">
                  Current:
                  {' '}
                  {
                    currentVideoName
                  }
                </span>

              )}


              <label className="home-upload-button">

                <Upload size={17} />

                {hasVideo
                  ? 'Replace Video'
                  : 'Upload Video'}


                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={
                    handleVideo
                  }
                />

              </label>


              {manufacturingVideo && (

                <span className="home-new-file">
                  New:
                  {' '}
                  {
                    manufacturingVideo
                      .name
                  }
                </span>

              )}

            </div>

          </div>

        </section>


        {/* DEPARTMENT STATS */}

        <section className="home-content-card">

          <div className="home-content-card-header">

            <div>

              <span className="home-content-section-number">
                04
              </span>

              <div>

                <h2>
                  Department Statistics
                </h2>

                <p>
                  Update the four figures
                  displayed above the
                  production departments.
                </p>

              </div>

            </div>

          </div>


          <div className="home-stats-grid home-stats-grid--four">

            {departmentStats.map(
              (
                stat,
                index
              ) => (

                <div
                  className="home-stat-editor"
                  key={
                    index
                  }
                >

                  <span className="home-stat-position">
                    Stat {
                      index + 1
                    }
                  </span>


                  <label>

                    <span>
                      Value
                    </span>

                    <input
                      value={
                        stat.value
                      }
                      onChange={
                        (
                          event
                        ) =>
                          updateDepartmentStat(
                            index,
                            'value',
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
                      Label
                    </span>

                    <input
                      value={
                        stat.label
                      }
                      onChange={
                        (
                          event
                        ) =>
                          updateDepartmentStat(
                            index,
                            'label',
                            event
                              .target
                              .value
                          )
                      }
                      required
                    />

                  </label>

                </div>

              )
            )}

          </div>

        </section>


        <div className="home-content-actions">

          <button
            type="submit"
            className="home-content-save"
            disabled={
              saving
            }
          >

            <Save size={18} />

            {saving
              ? 'Saving Changes...'
              : 'Save Home Content'}

          </button>

        </div>

      </form>

    </div>
  )
}


export default HomeContent