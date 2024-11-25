import { BiSearch, BiTrash } from 'react-icons/bi'
import AdminLayout from './AdminLayout'
import { useCallback, useEffect, useState } from 'react';
import axios from '../../services/axio-config';
import Modal from '../../components/Modal';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '../../components/Input';
import { coupon_code_validation } from '../../utils/input_validation';
import SearchInput from '../../components/SearchInput';

export default function CouponCodes() {
    const [couponCodes, setCouponCodes] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const methods = useForm();

    const loadCouponCodes = useCallback(async() => {
        try {
            let response = await axios.get("/coupon_codes");
            setCouponCodes(response.data.codes);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
     if(!couponCodes) {
        loadCouponCodes();
     }   
    }, [couponCodes, loadCouponCodes]);


    const addCode = async(data) => { 
        try {
            let response = await axios.post("/coupon_codes/add", {...data});
            console.log(response);

            setCouponCodes(codes => ([...codes, response.data.couponcode]));
            setShowModal(false);
        } catch (error) {
            console.log(error);

            if(error.status == 400) {
                let { errors } = error.response.data;

                if(errors.length) {
                    errors.forEach(error => {
                        methods.setError(error.path,{ type:"manual", message:error.msg  })
                    });
                }
            }
            
        }
    }

    const deleteCode = async(code) => {
        try {
            await axios.delete(`/coupon_codes/delete/${code}`);
            let new_codes = couponCodes.filter(coupon => coupon.code != code);
            setCouponCodes(new_codes);
        } catch (error) {
            console.log(error);
        }
    }

    const filterCodes = async (query) => {
        console.log(query);

        try {
            let response = await axios.get(`/coupon_codes_filter?code=${query}`);
            setCouponCodes(response.data.codes);
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = methods.handleSubmit(data => {
        addCode(data);
    });

    return (
        <AdminLayout>

            {
                showModal && <Modal closeModal={() => setShowModal(false)} activeTab="Add Code">
                    <FormProvider {...methods}>
                        <form className='w-30%'>
                            <Input 
                                {...coupon_code_validation} 
                                label="Coupon Code" 
                                id="code" 
                                name="code" 
                            />

                            <Input 
                                label="Expiration Date" 
                                id="expires_on" 
                                name="expires_on" 
                                type="date"
                                validation={{ required:{ value:true, message:"required"} }}
                            />


                            <div className="p-2">
                            <button
                                onClick={onSubmit}
                                className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#2c6353]/60 disabled:border-gray-300/60 disabled:text-[#2c6353]/60  p-3  w-full text-white cursor-pointer'
                                disabled={Object.keys(methods.formState.errors).length}
                            >
                                Add Code
                            </button>
                            </div>
                        </form>
                    </FormProvider>
                </Modal>
            }
            <div className="p-4 sm:ml-64 bg-gray-50 h-full">
                <div className="">
                    <div className="flex w-full flex-start py-2 items-center justify-between">
                        
                        {/* <form className="w-[50%]">   
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <BiSearch size={20} color='gray'/>
                                </div>

                                <input 
                                    type="search" id="default-search" 
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Search Codes..." 
                                    required 
                                />
                            </div>
                        </form> */}

                        <SearchInput onSearch={filterCodes}/>

                        <div className='actions'>
                            <button className='bg-[#0163AA] text-white p-3 rounded-md' onClick={() => setShowModal(true)}>Add Code</button>
                        </div>

                    </div>


                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-5 sm:text-xs">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Code
                                    </th>
                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Is Active
                                    </th>
                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Expires On
                                    </th>
                                    <th scope="col" className="px-3 py-2 text-sm">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    couponCodes && couponCodes.map(coupon_code => {
                                        return (
                                            <tr key={coupon_code.code}className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                   {coupon_code.code}
                                                </th>
                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                   {coupon_code.is_active ? "Active" : "Inactive"}
                                                </th>

                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                   {new Date(coupon_code.expires_on).toDateString()}
                                                </th>

                                                <th scope="row" className="text-xs px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                   <button className='mx-2 bg-red-400 text-white p-2 rounded-md' onClick={() => deleteCode(coupon_code.code)}>
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
                </div>
            </div>
        </AdminLayout>
    )
}
