import { FormProvider, useForm } from 'react-hook-form';
import LoginLayout from './loginLayout';
import { email_validation, name_validation, password_validation, phone_validation } from '../../utils/input_validation';
import { Input } from '../../components/Input';
import axios from '../../services/axio-config';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
    const methods = useForm();
    const navigate = useNavigate();

    const onSubmit = methods.handleSubmit((data) => {
        console.log(data);
        handleRegistration(data);
    });


    const handleRegistration = async(data) => {
        try {
            let response = await axios.post("/signup", {...data});
            console.log(response);

            // store user details on local storage
            localStorage.setItem("email", data.email);

            // redirect to verification page
            navigate("/verify_mail");
        } catch (error) {
            console.log(error);
        }
    }

    // login either using password or email
    return (
        <LoginLayout>
            <FormProvider {...methods}>
                <form action="" className="px-3">
                    <div className="my-3">
                        <Input  {...email_validation} label={"Email"} name="email"/>
                    </div>

                    <div className="my-3">
                        <Input {...phone_validation} label={"Phone Number"}  name="phone_number"/>
                    </div>

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
                        Register
                    </button>


                    <div className="my-5">
                       Already have an account. <a href="/signin" className="text-blue-900">Sign In.</a>
                    </div>
                </form>
            </FormProvider>
        </LoginLayout>
    )
}
