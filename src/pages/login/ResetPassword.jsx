import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { password_validation } from '../../utils/input_validation';
import { Input } from '../../components/Input';
import { FormProvider, useForm } from 'react-hook-form';
import axios from "../../services/axio-config";
import { useNavigate, useParams } from 'react-router-dom';


export default function ResetPassword() {
    const methods = useForm();
    const navigate = useNavigate();
    const { token } = useParams();

    const [error, setError] = useState();
    const [ successMessage, setSuccessMessage] = useState("")

    const onSubmit = methods.handleSubmit(data => {
        console.log(data);
        handleSubmit(data);
    });


    const handleSubmit = async(data) => {
        try {
            let response = await axios.post(`/reset_password/${token}/`, {...data, token });
            console.log(response);

            // redirect to verification page
            navigate("/signin");
        } catch (error) {
            console.log(error);

            if(error.status == 500) {
                setError(error.response.data)
            }
        }
    }



    return (
        <div className='w-full h-full relative overflow-x-hidden'>
            <Navbar />
            
            <div className="h-[80vh] bg-gray-100 p-20">
                <div className="flex items-center flex-col bg-white shadow-md max-w-[1080px] mx-auto md:w-[40%] w-full p-5 rounded-md">
                    <h5 className="font-semibold text-lg">Reset Password</h5>

                    <FormProvider {...methods}>
                        <form className="p-2 w-full p-5">
                        <p className="text-sm text-red-500">{error}</p>
                            <div className="flex flex-col">
                                <div className="my-3">
                                    <Input {...password_validation} name="password"/>
                                </div>

                                <div className="my-3">
                                    {/* <Input name="password-confirmation" {...password_validation} label={"Confirm Password"}/> */}

                                    <Input 
                                        {...password_validation} 
                                        name="password_confirmation" 
                                        id="password_confirmation" 
                                        label={"Confirm Password"} 
                                        validation={{
                                        ...password_validation.validation,
                                        validate: (val) => {
                                            if (methods.watch('password') != val) {
                                            return "Your passwords do no match";
                                            }
                                        },
                                        }} classname={""}
                                    />
                                </div>

                                <button
                                    onClick={onSubmit}
                                    className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#2c6353]/60 disabled:border-[#2c6353]/60 disabled:text-[#2c6353]/60  p-3  w-full text-white cursor-pointer'
                                    disabled={Object.keys(methods.formState.errors).length}
                                >
                                    Reset Password
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
