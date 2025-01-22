import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { otp_validation } from "../../utils/input_validation";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../services/axio-config";
import { useDispatch, useSelector } from "react-redux";
import { sessionActions } from "../../store";

export default function VerificationForm() {
    const methods = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);

    let email = localStorage.getItem("email");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(!email) {
            // navigate("/login");
        }
        
    }, [email, navigate]);


    const onSubmit = methods.handleSubmit((data) => {
        setIsLoading(true);
        handleVerification(data);
    })

    const handleVerification = async(data) => {
        try {
            let response = await axios.post("/verify_phone_otp", {...data, phone_number:user.phone_number});
            console.log(response);



            // store user details on local storage
            localStorage.setItem("email", data.email);

            dispatch(sessionActions.updateUser({ ...user, is_phone_number_verified:true }))
            localStorage.setItem("user", JSON.stringify({ ...user, is_phone_number_verified:true }));

            // redirect to login page or self authenticate the user
            // navigate("/signin");

            // close modal, update user data and phone verification
        } catch (err) {
            console.log(err);
            let { data: { message, error } } = err.response;

            if(error) {
                setError(error);
            }
            
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div>
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
                        {!isLoading ?  "Verify" : "Verifying"}
                       
                    </button>
                </form>
            </FormProvider>
        </div>
    )
}
