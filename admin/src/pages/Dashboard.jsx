import {
  Layers3,
  Package,
  Flame,
  Activity,
  ArrowRight,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'


const stats = [
  {
    title: 'Categories',
    value: '7',
    description:
      'Product categories',
    icon: Layers3,
  },

  {
    title: 'Products',
    value: '59',
    description:
      'Total products',
    icon: Package,
  },

  {
    title: 'Hot Selling',
    value: '0',
    description:
      'Featured products',
    icon: Flame,
  },

  {
    title: 'Active Products',
    value: '59',
    description:
      'Visible on website',
    icon: Activity,
  },
]


function Dashboard() {

  return (
    <div className="dashboard-page">

      <div className="admin-page-header">

        <div>
          <span className="admin-page-eyebrow">
            OVERVIEW
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Manage AYOSONS products,
            categories and featured
            collections.
          </p>
        </div>

      </div>


      <section className="dashboard-stats">

        {stats.map(
          ({
            title,
            value,
            description,
            icon: Icon,
          }) => (

            <article
              className="dashboard-stat-card"
              key={title}
            >

              <div className="dashboard-stat-top">

                <div className="dashboard-stat-icon">
                  <Icon
                    size={22}
                    strokeWidth={1.8}
                  />
                </div>

                <span>
                  {title}
                </span>

              </div>


              <strong>
                {value}
              </strong>


              <p>
                {description}
              </p>

            </article>

          )
        )}

      </section>


      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>
            <span className="admin-page-eyebrow">
              MANAGEMENT
            </span>

            <h2>
              Quick Actions
            </h2>
          </div>

        </div>


        <div className="quick-actions">

          <Link
            to="/categories"
            className="quick-action-card"
          >
            <Layers3 size={24} />

            <div>
              <strong>
                Manage Categories
              </strong>

              <span>
                Add and edit product
                categories.
              </span>
            </div>

            <ArrowRight size={20} />
          </Link>


          <Link
            to="/products"
            className="quick-action-card"
          >
            <Package size={24} />

            <div>
              <strong>
                Manage Products
              </strong>

              <span>
                Add, edit and organize
                products.
              </span>
            </div>

            <ArrowRight size={20} />
          </Link>


          <Link
            to="/hot-selling"
            className="quick-action-card"
          >
            <Flame size={24} />

            <div>
              <strong>
                Hot Selling
              </strong>

              <span>
                Select featured products
                for the website.
              </span>
            </div>

            <ArrowRight size={20} />
          </Link>

        </div>

      </section>

    </div>
  )
}


export default Dashboard