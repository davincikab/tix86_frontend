import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { name_validation, password_validation } from "../../utils/input_validation";
import LoginLayout from "./loginLayout";


export default function LoginPage() {
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
                        <Input name="email" {...name_validation} label={"Email or Phone Number"}/>
                    </div>

                    <div className="my-3">
                        <Input name="password" {...password_validation}/>
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
