import logo from '../assets/logo.png';
// import { useLocalization, useTranslation } from './LocalizationProvider';
// import { sessionActions } from '../../store';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../services/axio-config';
import { useState } from 'react';


const Navbar = () => {
    // const t = useTranslation();
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);
 
    const [state, setState] = useState({
        openLanguageDropwdown:false,
        openCollapsible:false
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        
        // send the refresh token
        try {
            await axios.post('/logout/', { token:localStorage.getItem("accessToken") });
            
            localStorage.setItem("user", "");
            localStorage.setItem("accessToken", "");
            localStorage.setItem("refreshToken", "");

            navigate('/signin');
        } catch(error) {
            console.log(error);
        }

        
    }
    // console.log(language);

    return (
        <nav className="bg-white border-b border-gray-200  dark:bg-gray-900 w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto md:p-4 p-2">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} alt="Pow pow" className='h-16' />
                </a>

                <div className="flex items-center md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse">
                    
                    <button data-collapse-toggle="navbar-language" onClick={() => { setState({...state, openCollapsible: !state.openCollapsible})}} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-language" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                </div>

                <div className={`items-center justify-between ${state.openCollapsible ? "" : "hidden"} w-full md:flex md:w-auto md:order-1`} id="navbar-language">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <NavLink to={'/'} className="block py-2 px-3 text-black rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" >Home</NavLink>
                        </li>

                        <li>
                            <NavLink to={'/profile'} className="block py-2 px-3 text-black rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" >Profile</NavLink>
                        </li>
                        
                        <li>
                            <NavLink to={'/admin'} className="block py-2 px-3 text-black rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" >Admin</NavLink>
                        </li>
                        

                        { 
                            !user ? <li>
                                <NavLink to={'/signin'} className="block py-2 px-3 text-black rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" >Log In</NavLink>
                            </li> :
                            <a href="/logout" onClick={handleLogout} className='mx-3'>Logout</a> 
                        }
                    
                    </ul>
                </div>
            </div>
        </nav>
    )
    // return (
    //     <header color="inherit">
    //         <div className={classes.root}>
    //             <div className=''>
    //                 <img src={logo} alt="" width={115}/>
    //             </div>


    //             {
    //                 user.user.role == "Administrator" ? (
    //                     <div>
    //                         <NavLink to={'/promotors'}>Promotor</NavLink>
    //                         <NavLink to={'/promotors'}>Housing Projects</NavLink>
    //                     </div>
    //                 ) : ""
    //             }
                
    //             <div className={classes.navEnd}>
    //                <a href="/logout" onClick={handleLogout} className='mx-3'>Logout</a>

    //                 <Select label={t('loginLanguage')} value={language} onChange={(e) => setLanguage(e.target.value)} className={classes.select}>
    //                     {languageList.map((it) => (
    //                     <MenuItem key={it.code} value={it.code}>
    //                         <Box component="span" sx={{ mr: 1 }}>
    //                             <ReactCountryFlag countryCode={it.country} svg />
    //                         </Box>
    //                         {it.name}
    //                     </MenuItem>
    //                     ))}
    //                 </Select>
    //             </div>
                
    //         </div>
    //     </header>
    // )
};

export default Navbar;
