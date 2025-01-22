/* eslint-disable react/prop-types */
import { useState, useRef } from 'react'
import useOnClickOutside from './useOutsideClick';
import { BiX } from 'react-icons/bi';

export default function Modal(props) {
    const [isOpen, setIsOpen] = useState(props.isOpen || true);
    const ref = useRef(null);

    const handleClick = () => {
        props.closeModal();
    }

    useOnClickOutside(ref, () => {
        handleClick();
    })

    return (
        <div id="static-modal" data-modal-backdrop="static" tabIndex="-1" aria-hidden="true"
            className={`overflow-y-auto overflow-x-hidden bg-black/60 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100vh-1rem)] max-h-full`}>
        <div className="relative p-4 w-full max-w-[40%] max-h-full mx-auto top-16">
        
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700" ref={ref}>
                
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                        {props.activeTab ? props.activeTab.split("_").join(" ") : ""}
                    </h3>
                    <button type="button" onClick={handleClick} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                        {/* <X /> */}
                        <BiX size={30} />
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                
                <div className="p-4 md:p-5 space-y-4  w-full overflow-auto">
                    {props.children}
                </div>
                
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    {/* <button data-modal-hide="static-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                    <button data-modal-hide="static-modal" onClick={() => setIsOpen(false)} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button> */}
                </div>
            </div>
        </div>
    </div>
  )
}
