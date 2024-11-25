/* eslint-disable react/prop-types */
import { debounce } from "lodash";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { BiSearch } from "react-icons/bi";

const SearchInput = ({ onSearch }) => {
    const { register } = useForm();

    const handleSearch = useCallback(
        debounce((searchTerm) => {
            onSearch(searchTerm);
        }, 200)
    ,[onSearch]);


    const handleChange = (e) => {
        const searchTerm = e.target.value;

        handleSearch(searchTerm);
    }


    return (
        <form className="w-[50%]">
            <div className="search-div  relative">
                {/* <Search  className='absolute top-3 left-2 text-[30px]'/> */}
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                   <BiSearch size={20} color='gray'/>
                </div>
                <input 
                    type="text" 
                    name="search" 
                    id="search" 
                    className="p-2 font-medium w-full placeholder:opacity-60 rounded-[12px] border border-gray-300 h-12 pl-10 focus:outline-none" 
                    placeholder='Search'
                    {...register("search", {
                        onChange: (e) => handleChange(e),
                    })}
                />
            </div>
        </form>
    )
}


export default SearchInput;