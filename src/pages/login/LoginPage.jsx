import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { email_validation, name_validation, password_validation, phone_validation } from "../../utils/input_validation";
import LoginLayout from "./loginLayout";
import axios from "../../services/axio-config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionActions } from "../../store";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";


export default function LoginPage() {
    const methods = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();

    const [identifier, setIdentifier] = useState("email");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = methods.handleSubmit((data) => {
        setError("");
        setIsLoading(true);
        handleLogin(data);
    })

    const handleLogin = async (data) => {
        // return;
        try {
            let response = await axios.post('/signin', {...data, username:data[identifier], identifier });
            let { user, accessToken, refreshToken } = response.data; 

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            dispatch(sessionActions.updateUser(user));
           
            
            navigate("/");
        } catch (error) {
            if(error['code'] == "ERR_NETWORK") {
                setError(error.message);
                return;
            }
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    const validateInput = (value) => {
        // autodetect a phone number or email
        setIdentifier(value)
    }

    // login either using password or email
    console.log(error);
    return (
        <LoginLayout>
            <FormProvider {...methods}>
                <form action="" className="px-3">
                    { error ? <p className="text-red-600">{error}</p> : ""}
                    <div className="my-3">
                        { 
                            identifier == "email" ? 
                            <Input  {...email_validation} label={"Email"} name="email"/> :
                            <Input  {...phone_validation} label={"Phone Number"} name="phone_number"/> 
                        }
                    </div>

                    <div className="my-3 relative">
                        <Input 
                            name="password" 
                            type={ showPassword ? "text" : "password" }
                            label="Password"
                            id="password"
                            validation={{ required: { value:true, message:"Required" }}}
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
                        {
                            !isLoading ? "Login" :
                            <div role="status" className='flex items-center'>
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <div className="mx-5">Logging In...</div>
                                <span className="sr-only">Loading...</span>
                            </div>
                        }
                        
                    </button>

                    <div className="flex justify-between">
                        <div></div>

                        <div>
                            <a href="/forgot_password" className="text-blue-900">Forgot Password?</a>
                        </div>
                    </div>

                    <div className="my-5 text-sm">
                        Don't have an account. <a href="/signup" className="text-blue-900 text-sm font-semibold">Sign Up.</a>
                    </div>
                </form>
            </FormProvider>
        </LoginLayout>
    )
}


// Add loader and focus colors, disable button (if email or password is empty) 
