import { useState } from 'react'
import '../../style/RequestQuote.css'
import api from '../../services/api'
import whatsappIcon from '../../assets/icons/whatsapp.png'
import emailIcon from '../../assets/icons/email.png'
import instagramIcon from '../../assets/icons/instagram.png'
import linkedinIcon from '../../assets/icons/linkedin.png'

const contactMethods = [
  {
    label: 'WhatsApp',
    value: '+92 XXX XXXXXXX',
    action: 'Chat With Us',
    href: 'https://wa.me/92XXXXXXXXXX',
    icon: whatsappIcon,
  },
  {
    label: 'Email',
    value: 'info@ayosons.com',
    action: 'Send An Email',
    href: 'mailto:info@ayosons.com',
    icon: emailIcon,
  },
  {
    label: 'Instagram',
    value: '@ayosons',
    action: 'Follow AYOSONS',
    href: '#',
    icon: instagramIcon,
  },
  {
    label: 'LinkedIn',
    value: 'AYOSONS Industries',
    action: 'Connect With Us',
    href: '#',
    icon: linkedinIcon,
  },
]

function RequestQuote() {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setStatus('submitting')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      await api.post(
        '/contact',
        Object.fromEntries(formData.entries())
      )

      setStatus('success')
      form.reset()
    } catch (error) {
      setStatus('error')
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
                Provide as much information as possible so we can
                better understand your manufacturing requirements.
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

              {/* Honeypot */}
              <input
                className="quote-honeypot"
                type="text"
                name="_gotcha"
                tabIndex="-1"
                autoComplete="off"
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

              <div className="quote-form-row">

                <div className="quote-field">
                  <label htmlFor="company">
                    Company / Brand
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Your brand name"
                  />
                </div>

                <div className="quote-field">
                  <label htmlFor="category">
                    Product Category *
                  </label>

                  <select
                    id="category"
                    name="productCategory"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    <option>Sports Wear</option>
                    <option>Streetwear</option>
                    <option>
                      Gym / Fitness / Activewear
                    </option>
                    <option>Varsity Jackets</option>
                    <option>Headwear</option>
                    <option>Workwear</option>
                    <option>Accessories</option>
                  </select>
                </div>

              </div>

              <div className="quote-form-row">

                <div className="quote-field">
                  <label htmlFor="quantity">
                    Estimated Quantity
                  </label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="text"
                    placeholder="e.g. 100 pieces"
                  />
                </div>

                <div className="quote-field">
                  <label htmlFor="service">
                    Requirement
                  </label>

                  <select
                    id="service"
                    name="requirement"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select requirement
                    </option>

                    <option>Custom Manufacturing</option>
                    <option>Private Label</option>
                    <option>Sampling</option>
                    <option>Bulk Production</option>
                    <option>Repeat Order</option>
                    <option>General Enquiry</option>
                  </select>
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
                  placeholder="Tell us about the product, materials, colors, branding, quantity, sizes and any other requirements..."
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

              {status === 'success' && (
                <p className="quote-message quote-success">
                  Thank you. Your enquiry has been sent successfully.
                </p>
              )}

              {status === 'error' && (
                <p className="quote-message quote-error">
                  Something went wrong. Please try again or contact us directly.
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
              href="https://wa.me/92XXXXXXXXXX"
              target="_blank"
              rel="noreferrer"
            >
              <div className="quote-whatsapp-icon">
  <img
    src={whatsappIcon}
    alt="WhatsApp"
  />
</div>

              <div>
                <span>Quick Contact</span>

                <strong>WhatsApp Us Now</strong>

                <p>
                  +92 XXX XXXXXXX
                </p>
              </div>

              <span className="quote-contact-arrow">
                →
              </span>
            </a>

            <div className="quote-contact-list">
              {contactMethods
                .slice(1)
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