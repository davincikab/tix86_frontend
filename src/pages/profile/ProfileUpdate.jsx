import React from 'react'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProfileUpdate() {
    const profile = "one";

  return (
    <div className='w-full h-full relative overflow-x-hidden '>
        <Navbar />
        
        <div className="relative h-auto bg-gray-300 p-5 min-h-[80vh]">
            <p>Loading User Data</p>

            <div className='bg-gray-500 h-40'>
              
            </div>
        </div>
        <Footer></Footer>
    </div>
  )
}
