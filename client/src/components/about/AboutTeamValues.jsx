import '../../style/about/AboutTeamValues.css'

const team = [
  {
    initials: 'AY',
    title: 'Leadership',
    role: 'Strategy, direction and long-term growth',
  },
  {
    initials: 'PR',
    title: 'Production',
    role: 'Manufacturing, quality and delivery oversight',
  },
  {
    initials: 'BD',
    title: 'Business Development',
    role: 'Customer relationships and global partnerships',
  },
  {
    initials: 'OP',
    title: 'Operations',
    role: 'Planning, coordination and export execution',
  },
]

const values = [
  {
    title: 'Reliability',
    text: 'We focus on consistent coordination, dependable manufacturing and practical delivery planning.',
  },
  {
    title: 'Transparency',
    text: 'Clear communication keeps customers informed from product development through final shipment.',
  },
  {
    title: 'Customer Focus',
    text: 'Every order is handled around the customer’s product, quality, quantity and timeline requirements.',
  },
]

function AboutTeamValues() {
  return (
    <div className="about-team-values">
      <section className="about-team-section">
        <div className="about-team-heading">
          <p className="about-team-kicker">
            <span aria-hidden="true" />
            Our Leadership
          </p>
          <h2>Meet the Executive Team</h2>
        </div>

        <div className="about-team-grid">
          {team.map((member) => (
            <article className="about-team-card" key={member.title}>
              <div className="about-team-avatar" aria-hidden="true">
                {member.initials}
              </div>

              <div className="about-team-card-copy">
                <h3>{member.title}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-values-heading">
          <p className="about-team-kicker">
            <span aria-hidden="true" />
            Our Values
          </p>
          <h2>How We Work</h2>
        </div>

        <div className="about-values-grid">
          {values.map((value, index) => (
            <article className="about-value-card" key={value.title}>
              <span className="about-value-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutTeamValues
