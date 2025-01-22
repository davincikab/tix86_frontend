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
import ResetPasswordPage from './pages/login/RequestResetPasswordPage';
import RegistrationVerificationPage from './pages/login/RegistrationVerification';
import ChangePassword from './pages/login/ChangePassword';
import { useSelector } from 'react-redux';
import AdminPage from './pages/admin';
import Customer from './pages/admin/Customers';
import CouponCodes from './pages/admin/CouponCodes';
import ProfileUpdate from './pages/profile/ProfileUpdate';
import RequestResetPasswordPage from './pages/login/RequestResetPasswordPage';
import ResetPassword from './pages/login/ResetPassword';
import PaymentCanceled from './pages/profile/PaymentCanceled';
import Page404 from './404';
  

const ProtectedRoute = ({ redirectPath="/signin", isAllowed, children}) => {
  if(!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}
const Navigation = () => {
  const user= useSelector(state => state.session.user);
  // const user = profile ? profile.user : null;
  const isAdmin = (roles) => {
    return roles && roles[0].name == "admin";
  }
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

          <Route path="/payment_canceled" 
            element={
              <ProtectedRoute isAllowed={user && user.email}>
                <PaymentCanceled />
              </ProtectedRoute> 
            } 
          />
          <Route path="/profile_update" 
            element={
              <ProtectedRoute isAllowed={user && user.email}>
                <ProfileUpdate />
              </ProtectedRoute> 
            } 
          />

          <Route path="/admin" 
            element={
              <ProtectedRoute redirectPath="/" isAllowed={user && isAdmin(user.roles)}>
                <AdminPage />
              </ProtectedRoute> 
            } 
          />

          <Route path="/admin/customers" 
            element={
              <ProtectedRoute redirectPath="/" isAllowed={user && isAdmin(user.roles)}>
                <Customer />
              </ProtectedRoute> 
            } 
          />

          <Route path="/admin/coupon_codes" 
            element={
              <ProtectedRoute redirectPath="/" isAllowed={user && isAdmin(user.roles)} >
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
          
          <Route path="/forgot_password" element={<RequestResetPasswordPage />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />

          <Route path="/" element={ <App />}>
            <Route index element={ <MainPage />} />
          </Route>

          <Route path="*" element={ <Page404 />}>
          </Route>
      </Routes>
  );
};
  
export default Navigation;
  