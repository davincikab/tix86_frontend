/* eslint-disable react/prop-types */
import logo from '../../assets/logo.png';

const LoginLayout = (props) => {
    return(
        <div className="login-container h-[100vh] flex items-center justify-center">
            <div className="md:w-[400px] bg-[#829bb7b3] md:bg-white rounded-[14px] shadow-none md:shadow-lg w-[90%] text-white md:text-gray-900 p-4">
                <div className="logo flex items-center justify-center">
                    <img src={logo} alt=""  className='h-32 md:mix-blend-normal  mix-blend-color-burn'/>
                </div>
                {props.children}
            </div>
        </div>
    )
}

export default LoginLayout;