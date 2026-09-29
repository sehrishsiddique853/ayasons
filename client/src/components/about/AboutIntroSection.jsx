import '../../style/about/AboutIntroSection.css'

const aboutStats = [
  { value: '2015', label: 'Established In Sialkot' },
  { value: '10+', label: 'Years Of Experience' },
  { value: '150+', label: 'Skilled Professionals' },
  { value: '07', label: 'Product Categories' },
]

function AboutIntroSection() {
  return (
    <section className="about-intro-hero">
      <div className="about-intro-copy">
        <p className="about-intro-kicker">
          <span aria-hidden="true" />
          Our Company
        </p>

        <h1>
          <span>Built In Sialkot.</span>
          <span>Made For</span>
          <span>The World.</span>
        </h1>

        <p className="about-intro-description">
          AYOSONS brings product development, skilled manufacturing and
          export-ready quality together to help brands, teams and businesses
          build dependable custom apparel collections.
        </p>
      </div>

      <div className="about-intro-stats" aria-label="AYOSONS company facts">
        {aboutStats.map((stat) => (
          <article className="about-intro-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AboutIntroSection
