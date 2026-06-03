import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import OfferBanner from '../components/OfferBanner'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import UploadPrescription from '../components/UploadPrescription'
import WhyMediCart from '../components/WhyMediCart'
import Footer from '../components/Footer'

export default function HomePage({ searchVisible, onSearchVisibilityChange }) {
  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <Navbar searchVisible={searchVisible} />
      <main>
        <HeroSection onSearchVisibilityChange={onSearchVisibilityChange} />
        <OfferBanner />
        <div className="py-4" />
        <Categories />
        <FeaturedProducts />
        <UploadPrescription />
        <WhyMediCart />
      </main>
      <Footer />
    </div>
  )
}