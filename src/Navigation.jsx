import {
    Route, Routes,
  } from 'react-router-dom';
import MainPage from './pages/main';

import App from './App';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/login/SignupPage';
import ProfilePage from './pages/profile';
import ResetPasswordPage from './pages/login/ResetPasswordPage';
import RegistrationVerificationPage from './pages/login/RegistrationVerification';
  
const Navigation = () => {
    return (
      <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify_mail" element={<RegistrationVerificationPage /> } />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot_password" element={<ResetPasswordPage />} />

          <Route path="/" element={ <App />}>
            <Route index element={ <MainPage />} />
          </Route>
      </Routes>
    );
};
  
export default Navigation;
  