import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { email_validation } from "../../utils/input_validation";
import LoginLayout from "./loginLayout";
import { useState } from "react";
import axios from '../../services/axio-config';


export default function RequestResetPasswordPage() {
    const methods = useForm();
    const [error, setError] = useState();
    const [ successMessage, setSuccessMessage] = useState("")

    const onSubmit = methods.handleSubmit(async(data) => {
        console.log(data);

        try {
            let response = await axios.post("/send_password_reset_link", {...data});
            console.log(response);
            setSuccessMessage(response.data);
        } catch (error) {
            console.log(error);

            if(error.status == 500) {
                setError(error.response.data);
            }
        }
        // 
    })

    // login either using password or email
    return (
        <LoginLayout>
            <FormProvider {...methods}>
                <form action="" className="px-3">
                    <p>{successMessage}</p>
                    <p className="text-sm text-red-500">{error}</p>
                    <div className="my-3">
                        <Input name="email" {...email_validation} label={"Email"}/>
                    </div>

                    <button
                        onClick={onSubmit}
                        className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#2c6353]/60 disabled:border-[#2c6353]/60 disabled:text-[#2c6353]/60  p-3  w-full text-white cursor-pointer'
                        disabled={Object.keys(methods.formState.errors).length}
                    >
                        Submit
                    </button>
                </form>
            </FormProvider>
        </LoginLayout>
    )
}
