import SearchInput from '../../components/SearchInput'
import AdminLayout from './AdminLayout';

import axios from '../../services/axio-config'
import { BiTrash } from 'react-icons/bi';
import { useEffect, useState, useCallback } from 'react';
import { formatPhoneNumber } from 'react-phone-number-input';

export default function CustomerPage() {
  const [customers, setCustomers] = useState(null);

  const getCustomers = useCallback(async () => {
    try {
      let response = await axios.get(`/get_customers`);
      setCustomers(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if(!customers) {
      getCustomers();
    }
  }, [customers, getCustomers]);

  const filterUserByEmail = async(value) => {
      try {
        let response = await axios.get(`/get_customers?search=${value}`);
        setCustomers(response)
      } catch (error) {
        console.log(error);
      }
  }
  return (
    <AdminLayout>
        <div className="p-4 sm:ml-64 bg-white h-full">
            <p>Customers</p>
            <SearchInput onSearch={filterUserByEmail}/>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-5 sm:text-xs">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Email
                                    </th>
                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Is Active
                                    </th>
                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Phone Number
                                    </th>

                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Subscription
                                    </th>

                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Phone Number
                                    </th>

                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    customers && customers.map(customer => {
                                        return (
                                            <tr key={customer.id}className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                   {customer.email}
                                                </th>
                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                   <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                      {customer.is_verified ? "Active" : "Inactive"}
                                                   </span>
                                                </th>

                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                  { formatPhoneNumber(customer.phone_number)}
                                                </th>

                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                   {customer.is_active ? "Active" : "Inactive"}
                                                </th>

                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                  
                                                </th>

                                            <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                               <button className='mx-2 bg-red-400 text-white p-2 rounded-md' onClick={() => console.log("Delete")}>
                                                    <BiTrash size={20}/>
                                               </button>
                                               <button className='mx-2'></button>
                                            </th>
                                        </tr>
                                    )
                                })
                            }
                            
                        </tbody>
                    </table>
                </div>

            <div className="pagination"></div>
        </div>
    </AdminLayout>
  )
}
