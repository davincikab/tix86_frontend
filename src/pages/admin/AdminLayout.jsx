/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import { LuLayoutDashboard } from 'react-icons/lu';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { BiShoppingBag, BiUser } from 'react-icons/bi';
import useOnClickOutside from '../../components/useOutsideClick';

export default function AdminLayout(props) {
    const [showSidebar, setShowSideBar] = useState(false);

    const ref = useRef(null);
    useOnClickOutside(ref, () => {
        setShowSideBar(false);
    });
    return (
        <div className='w-full h-full relative overflow-x-hidden '>
            <Navbar />
            <div className="dashboard-layout relative h-full">
                <div className='bg-gray-50'>
                    <button 
                        type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-[#096eb7] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        onClick={() => setShowSideBar(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                </div>
               

                <aside 
                    id="default-sidebar" 
                    className={`absolute top-0 left-0 z-40 w-64 bottom-0 transition-transform ${ !showSidebar ? '-translate-x-full' : ""} sm:translate-x-0`}
                    aria-label="Sidebar"
                    ref={ref}
                >
                    <div className="h-full px-3 py-4 overflow-y-auto bg-[#0163AA] dark:bg-gray-800 text-white">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <a href="/admin" className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-[#096eb7] dark:hover:bg-gray-700 group">
                                <LuLayoutDashboard size={30}/>
                                <span className="ms-3">Dashboard</span>
                                </a>
                            </li>
                        
                            <li>
                                <a href="/admin/customers" className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-[#096eb7] dark:hover:bg-gray-700 group">
                                <BiUser size={30} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
                                </a>
                            </li>

                            <li>
                                <a href="/admin/coupon_codes" className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-[#096eb7] dark:hover:bg-gray-700 group">
                                <BiShoppingBag size={30}/>
                                <span className="flex-1 ms-3 whitespace-nowrap">Coupon Code</span>
                                </a>
                            </li>

                        </ul>
                    </div>
                </aside>

                <div className="h-full w-full">
                    {props.children}
                </div>

            </div>
            <Footer />
        </div>
    )
}
