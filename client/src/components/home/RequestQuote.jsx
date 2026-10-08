import { useState } from 'react'
import '../../style/RequestQuote.css'
import api from '../../services/api'
import whatsappIcon from '../../assets/icons/whatsapp.png'
import emailIcon from '../../assets/icons/email.png'
import instagramIcon from '../../assets/icons/instagram.png'
import linkedinIcon from '../../assets/icons/linkedin.png'
import facebookIcon from '../../assets/icons/communication.png'
import { useContactSettings } from '../../context/contactSettings'

const contactMethodConfig = [
  {
    field: 'email',
    label: 'Email',
    icon: emailIcon,
  },
  {
    field: 'phone',
    label: 'Phone',
    icon: whatsappIcon,
  },
  {
    field: 'instagram',
    label: 'Instagram',
    icon: instagramIcon,
  },
  {
    field: 'linkedin',
    label: 'LinkedIn',
    icon: linkedinIcon,
  },
  {
    field: 'facebook',
    label: 'Facebook',
    icon: facebookIcon,
  },
]

const getContactHref = (field, value) => {
  if (field === 'email') return `mailto:${value}`
  if (field === 'phone') return `tel:${value.replace(/[^+\d]/g, '')}`
  return value
}

const getContactDisplayValue = (field, value) => {
  if (field === 'email' || field === 'phone') return value

  return value
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/\/$/, '')
}

function RequestQuote() {
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const contactSettings = useContactSettings()
  const whatsappHref = contactSettings.whatsapp
    ? `https://wa.me/${contactSettings.whatsapp.replace(/\D/g, '')}`
    : ''
  const contactMethods = contactMethodConfig
    .filter((method) => contactSettings[method.field])
    .map((method) => ({
      ...method,
      value: getContactDisplayValue(
        method.field,
        contactSettings[method.field]
      ),
      href: getContactHref(
        method.field,
        contactSettings[method.field]
      ),
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()

    setStatus('submitting')
    setFeedback('')

    const form = event.currentTarget
    try {
      await api.post(
        '/contact',
        Object.fromEntries(new FormData(form).entries())
      )

      setStatus('success')
      setFeedback('Thank you. Your message has been sent successfully.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setFeedback(
        error.response?.data?.message ||
        'Unable to send your message right now. Please try again.'
      )
    }
  }

  return (
    <main className="quote-page">

      <section className="quote-hero">
        <div className="quote-hero-inner">

          <p className="quote-kicker">
            Start Your Project
          </p>

          <h1>
            Request A
            <span> Quote.</span>
          </h1>

          <p>
            Tell us what you want to manufacture.
            Share your product, quantity and customization
            requirements and our team can discuss the next steps.
          </p>

        </div>
      </section>

      <section className="quote-section" id="contact">
        <div className="quote-layout">

          {/* LEFT SIDE - FORM */}

          <div className="quote-form-column">

            <div className="quote-section-heading">
              <span>Project Enquiry</span>

              <h2>
                Send Us A
                <strong> Message</strong>
              </h2>

              <p>
                Send us your contact details and tell us about your project.
                Our team will get back to you with the next steps.
              </p>
            </div>

            <form
              className="quote-form"
              onSubmit={handleSubmit}
            >

              <input
                type="hidden"
                name="_subject"
                value="New AYOSONS Website Quote Request"
              />

              <div className="quote-field">
                <label htmlFor="fullName">
                  Your Full Name *
                </label>

                <input
                  id="fullName"
                  name="name"
                  type="text"
                  placeholder="John Smith"
                  required
                />
              </div>

              <div className="quote-field">
                <label htmlFor="email">
                  Email Address *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@yourbrand.com"
                  required
                />
              </div>

              <div className="quote-form-row">

                <div className="quote-field">
                  <label htmlFor="phone">
                    Phone / WhatsApp
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="quote-field">
                  <label htmlFor="country">
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="United Kingdom"
                  />
                </div>

              </div>

              <div className="quote-field">
                <label htmlFor="message">
                  Tell Us About Your Project *
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Tell us about your project, product ideas, materials, colors, branding, sizes or any other requirements..."
                  required
                />
              </div>

              <button
                className="quote-submit"
                type="submit"
                disabled={status === 'submitting'}
              >
                {status === 'submitting'
                  ? 'Sending...'
                  : 'Send Quote Request'}

                <span aria-hidden="true">→</span>
              </button>

              {feedback && (
                <p
                  className={
                    status === 'success'
                      ? 'quote-message quote-success'
                      : 'quote-message quote-error'
                  }
                >
                  {feedback}
                </p>
              )}

            </form>

          </div>

          {/* RIGHT SIDE */}

          <aside className="quote-contact-column">

            <div className="quote-contact-intro">
              <p>Contact AYOSONS</p>

              <h2>
                Prefer To Talk
                <span> Directly?</span>
              </h2>

              <p>
                Reach our team through your preferred channel
                for product, sampling and manufacturing enquiries.
              </p>
            </div>

            <a
              className="quote-whatsapp-card"
              href={whatsappHref || undefined}
              target={whatsappHref ? '_blank' : undefined}
              rel={whatsappHref ? 'noreferrer' : undefined}
            >
              <div className="quote-whatsapp-icon">
  <img
    src={whatsappIcon}
    alt="WhatsApp"
    loading="lazy"
    decoding="async"
  />
</div>

              <div>
                <span>Quick Contact</span>

                <strong>WhatsApp Us Now</strong>

                <p>
                  {contactSettings.whatsapp || 'WhatsApp details coming soon'}
                </p>
              </div>

              <span className="quote-contact-arrow">
                →
              </span>
            </a>

            <div className="quote-contact-list">
              {contactMethods
                .map((method) => (
                  <a
                    className="quote-contact-card"
                    href={method.href}
                    key={method.label}
                    target={
                      method.href.startsWith('http')
                        ? '_blank'
                        : undefined
                    }
                    rel={
                      method.href.startsWith('http')
                        ? 'noreferrer'
                        : undefined
                    }
                  >
                    <div className="quote-contact-icon">
  <img
    src={method.icon}
    alt={`${method.label} icon`}
    loading="lazy"
    decoding="async"
  />
</div>

                    <div className="quote-contact-details">
                      <span>{method.label}</span>

                      <strong>{method.value}</strong>
                    </div>

                    <span className="quote-contact-arrow">
                      →
                    </span>
                  </a>
                ))}
            </div>

            <div className="quote-response-note">
              <span>Before You Enquire</span>

              <h3>
                Helpful Information
              </h3>

              <p>
                If available, include your estimated quantity,
                product category, reference images and branding
                requirements. This helps us understand your project
                more clearly.
              </p>
            </div>

          </aside>

        </div>
      </section>

    </main>
  )
}

export default RequestQuote
