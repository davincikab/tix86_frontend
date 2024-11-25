import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { name_validation, password_validation, phone_validation } from "../../utils/input_validation";
import LoginLayout from "./loginLayout";
import axios from "../../services/axio-config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sessionActions } from "../../store";


export default function LoginPage() {
    const methods = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("email");
    const [error, setError] = useState("");

    const onSubmit = methods.handleSubmit((data) => {
        console.log(data);

        // 
        handleLogin(data);
    })

    const handleLogin = async (data) => {
        try {
            let response = await axios.post('/signin', {...data, username:data[identifier], identifier });
            let { user, accessToken, refreshToken } = response.data; 

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            dispatch(sessionActions.updateUser(user));
           
            
            navigate("/");
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
        }
    }

    const validateInput = (value) => {
        // autodetect a phone number or email
        setIdentifier(value)
    }

    // login either using password or email
    return (
        <LoginLayout>
            <FormProvider {...methods}>
                <form action="" className="px-3">
                    { error ? <p className="text-red-600">{error}</p> : ""}
                    <div className="my-3">
                        { 
                            identifier == "email" ? 
                            <Input  {...name_validation} label={"Email"} name="email"/> :
                            <Input  {...phone_validation} label={"Phone Number"} name="phone_number"/> 
                        }
                    </div>

                    <div className="my-3">
                        <Input name="password"  type={"password"}/>
                    </div>

                    <button
                        onClick={onSubmit}
                        className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#2c6353]/60 disabled:border-[#2c6353]/60 disabled:text-[#2c6353]/60  p-3  w-full text-white cursor-pointer'
                        disabled={Object.keys(methods.formState.errors).length}
                    >
                        Login
                    </button>

                    <div className="flex justify-between">
                        <div></div>

                        <div>
                            <a href="/forgot_password" className="text-blue-900">Forgot Password?</a>
                        </div>
                    </div>

                    <div className="my-5 text-sm">
                        Don't have an account. <a href="/signup" className="text-blue-900 text-sm">Sign Up.</a>
                    </div>
                </form>
            </FormProvider>
        </LoginLayout>
    )
}
