import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { otp_validation } from "../../utils/input_validation";
import LoginLayout from "./loginLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/axio-config";


export default function RegistrationVerificationPage() {
    const methods = useForm();
    const navigate = useNavigate();
    let email = localStorage.getItem("email");
    const [error, setError] = useState("");

    useEffect(() => {
        if(!email) {
            // navigate("/login");
        }
        
    }, [email, navigate]);


    const onSubmit = methods.handleSubmit((data) => {
        console.log(data);
        handleVerification(data);
    })

    const handleVerification = async(data) => {
        try {
            let response = await axios.post("/verification", {...data, email});
            console.log(response);

            // store user details on local storage
            localStorage.setItem("email", data.email);

            // redirect to login page or self authenticate the user
            navigate("/signin");
        } catch (error) {
            console.log(error);
            let { data: { message } } = error.response;

            if(message == "Email has been verified") {
                navigate("/login")
            } else {
                setError(error.response.data.message);
            }
            
        }
    }

    // login either using password or email
    return (
        <LoginLayout>
            <FormProvider {...methods}>
                <form action="" className="px-3">
                    { error ? <p className="text-red-600">{error}</p> : ""}
                    <div className="my-3">
                        <Input {...otp_validation} label={"Verification Code"} name="otp_code"/>
                    </div>

                    <button
                        onClick={onSubmit}
                        className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#2c6353]/60 disabled:border-[#2c6353]/60 disabled:text-[#2c6353]/60  p-3  w-full text-white cursor-pointer'
                        disabled={Object.keys(methods.formState.errors).length}
                    >
                        Verify
                    </button>
                </form>
            </FormProvider>
        </LoginLayout>
    )
}
