import Hero from '../components/home/Hero'
import AboutSection from '../components/home/AboutSection'
import ManufactureSection from '../components/home/ManufactureSection'
import Manufacture from '../components/home/ManufacturingExcellence'
import DepartmentSection from '../components/home/DepartmentsSection'
import BuyerTypesSection from '../components/home/BuyerTypesSection'
import BestSellerSection from '../components/home/BestSellersSection'
import ProcessSection from '../components/home/ProcessSection'
import FactoryFactsSection from '../components/home/FactoryFactsSection'
import StandardsSection from '../components/home/StandardsSection'
import FactoryDirectSection from '../components/home/FactoryDirectSection'
import RequestQuote from '../components/home/RequestQuote'
import Footer from '../components/home/Footer'

function Home() {
  return (
    <>
      <Hero />
      <ManufactureSection />
        <AboutSection />
      <Manufacture />
      <DepartmentSection />
      <BuyerTypesSection />
      <BestSellerSection />
      <ProcessSection />
      <FactoryFactsSection />
      <StandardsSection />
      <FactoryDirectSection/>
      <RequestQuote />
      <Footer />
    </>
  )
}

export default Home
