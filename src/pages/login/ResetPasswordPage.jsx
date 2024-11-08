import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { name_validation, password_validation } from "../../utils/input_validation";
import LoginLayout from "./loginLayout";


export default function ResetPasswordPage() {
    const methods = useForm();

    const onSubmit = methods.handleSubmit((data) => {
        console.log(data);

        // 
    })

    // login either using password or email
    return (
        <LoginLayout>
            <FormProvider {...methods}>
                <form action="" className="px-3">
                    <div className="my-3">
                        <Input name="email" {...name_validation} label={"Email"}/>
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
