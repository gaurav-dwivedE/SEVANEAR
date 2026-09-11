import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Professionals from './components/Professionals'
import HowItWorks from './components/HowItWorks'
import WhyChooseUs from './components/WhyChooseUs'
import Footer from './components/Footer'


const App = () => {
  return (
    <>
    <Navbar />
    <Hero />
    <Services />
    <Professionals />
    <HowItWorks />
    <WhyChooseUs />
    <Footer />
    </>
  )
}

export default App