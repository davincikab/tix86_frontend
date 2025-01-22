import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { password_validation } from '../../utils/input_validation';
import { Input } from '../../components/Input';
import { FormProvider, useForm } from 'react-hook-form';
import axios from "../../services/axio-config";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

export default function ChangePassword() {
    const methods = useForm();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = methods.handleSubmit(data => {
        console.log(data);
        handleSubmit(data);
    });


    const handleSubmit = async(data) => {
        try {
            let response = await axios.post("/change_password", {...data, email:user.email});
            console.log(response);

            // redirect to verification page
            navigate("/profile");
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div className='w-full h-full relative overflow-x-hidden'>
            <Navbar />
            
            <div className="h-[80vh] md:bg-gray-100 md:p-20 p-10">
                <div className="flex items-center flex-col bg-white shadow-md max-w-[1080px] mx-auto md:w-[40%] w-full p-5 rounded-md">
                    <h5 className="font-semibold text-lg">Change Password</h5>

                    <FormProvider {...methods}>
                        <form className="p-2 w-full p-5">
                            <div className="flex flex-col">
                                <div className="my-3 relative">
                                    <Input {...password_validation} name="password" type={ showPassword ? "text" : "password" }/>
                                    <div className="absolute top-10 right-3 bg-red-0 z-10 p-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {!showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                                    </div>
                                </div>

                                <div className="my-3 relative">
                                    {/* <Input name="password-confirmation" {...password_validation} label={"Confirm Password"}/> */}

                                    <Input 
                                        {...password_validation} 
                                        name="password_confirmation" 
                                        id="password_confirmation" 
                                        label={"Confirm Password"} 
                                        type={ showPassword ? "text" : "password" }
                                        validation={{
                                        ...password_validation.validation,
                                        validate: (val) => {
                                            if (methods.watch('password') != val) {
                                            return "Your passwords do no match";
                                            }
                                        },
                                        }} classname={""}
                                    />


                                    <div className="absolute top-10 right-3 bg-red-0 z-10 p-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                        {!showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
                                    </div>
                                </div>

                                <button
                                    onClick={onSubmit}
                                    className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#2c6353]/60 disabled:border-[#2c6353]/60 disabled:text-[#2c6353]/60  p-3  w-full text-white cursor-pointer'
                                    disabled={Object.keys(methods.formState.errors).length}
                                >
                                    Update Password
                                </button>
                            </div>


                        </form>

                    </FormProvider>
                </div>
                
            </div>
            <Footer />
        </div>
    )
}
