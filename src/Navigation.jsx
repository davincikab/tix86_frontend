/* eslint-disable react/prop-types */
import {
  Navigate,
    Outlet,
    Route, Routes,
  } from 'react-router-dom';
import MainPage from './pages/main';

import App from './App';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/login/SignupPage';
import ProfilePage from './pages/profile';
import ResetPasswordPage from './pages/login/ResetPasswordPage';
import RegistrationVerificationPage from './pages/login/RegistrationVerification';
import ChangePassword from './pages/login/ChangePassword';
import { useSelector } from 'react-redux';
import AdminPage from './pages/admin';
import Customer from './pages/admin/Customers';
import CouponCodes from './pages/admin/CouponCodes';
  

const ProtectedRoute = ({ redirectPath="/signin", isAllowed, children}) => {
  if(!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}
const Navigation = () => {
  const user = useSelector(state => state.session.user);

  return (
      <Routes>
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify_mail" element={<RegistrationVerificationPage /> } />

          <Route path="/profile" 
            element={
              <ProtectedRoute isAllowed={user && user.email}>
                <ProfilePage />
              </ProtectedRoute> 
            } 
          />

          <Route path="/admin" 
            element={
              <ProtectedRoute isAllowed={user && user.email}>
                <AdminPage />
              </ProtectedRoute> 
            } 
          />

          <Route path="/admin/customers" 
            element={
              <ProtectedRoute isAllowed={user && user.email}>
                <Customer />
              </ProtectedRoute> 
            } 
          />

          <Route path="/admin/coupon_codes" 
            element={
              <ProtectedRoute isAllowed={user && user.email}>
                <CouponCodes />
              </ProtectedRoute> 
            } 
          />

          <Route path="/change_password" 
            element={
              <ProtectedRoute isAllowed={user && user.email}>
                <ChangePassword />
              </ProtectedRoute> 
            } 
          />
          
          <Route path="/forgot_password" element={<ResetPasswordPage />} />

          <Route path="/" element={ <App />}>
            <Route index element={ <MainPage />} />
          </Route>
      </Routes>
  );
};
  
export default Navigation;
  