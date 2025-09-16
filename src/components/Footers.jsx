import React from 'react'
import ContactUsImg from '../assets/ContactUsImg.jpg'
import { Truck } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faHeadset, faLock } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './Footer.css'

const Footers = () => {
  return (
    <>
      {/* ========== FOOTER ========== */}

      <div className="features-section">
        <div className="feature-card ">
          <FontAwesomeIcon icon={faThumbsUp} size='2x'className='mb-2 feature-icon'/>
          <div className="feature-title">Quality Products</div>
          <p className="feature-text">Best in Market, Trusted by 10,000+ Customers</p>
        </div>
        <div className="feature-card">
          <FontAwesomeIcon icon={faHeadset}   size='2x'className='mb-2 feature-icon'/>
          <div className="feature-title">Customer Support</div>
          <p className="feature-text">We’re here Mon–Fri to help with all your queries.</p>
        </div>
        <div className="feature-card">
          <FontAwesomeIcon icon={faLock}  size='2x'className='mb-2 feature-icon'/>

          <div className="feature-title">Secure Payment</div>
          <p className="feature-text">Your payment info is encrypted &amp; safe with us.</p>
        </div>
        <div className="feature-card">
          <FontAwesomeIcon icon={faWhatsapp}  size='2x'className='mb-2 feature-icon'/>
          <div className="feature-title">WhatsApp Help</div>
          <p className="feature-text">Need help fast? Message us on WhatsApp.</p>
        </div>
      </div>

      <footer className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">

       


        


        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
          <div className="col-span-full hidden lg:col-span-1 lg:block">
            <a className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80" href="#" aria-label="Brand">Brand</a>
            <p className="mt-3 text-xs sm:text-sm text-gray-600">
              © 2025 Preline Labs.
            </p>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase">Product</h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Pricing</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Changelog</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Docs</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Download</a></p>
            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase">Company</h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">About us</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Blog</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Careers</a> <span className="inline text-blue-600">— We're hiring</span></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Customers</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Newsroom</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Sitemap</a></p>
            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase">Resources</h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Community</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Help & Support</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">eBook</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">What's New</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Status</a></p>
            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase">Developers</h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Api</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Status</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">GitHub</a> <span className="inline text-blue-600">— New</span></p>
            </div>

            <h4 className="mt-7 text-xs font-semibold text-gray-900 uppercase">Industries</h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Financial Services</a></p>
              <p><a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" href="#">Education</a></p>
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}

      </footer>
      {/* ========== END FOOTER ========== */}
    </>
  )
}

export default Footers
