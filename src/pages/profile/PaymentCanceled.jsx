import React from 'react'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'

export default function PaymentCanceled() {
  return (
    <div className='w-full h-full relative overflow-x-hidden'>
        <Navbar />
        <div className="h-[70vh] bg-gray-100 p-20 flex items-center justify-center">
            <a className='p-3 shadow-md rounded-md text-white bg-[#0163AA] w-80 text-center' href='/profile'>
                Payment Failed. Kindly Retry.
            </a>
        </div>

        <Footer />
    </div>
  )
}
