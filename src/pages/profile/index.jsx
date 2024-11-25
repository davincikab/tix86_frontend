/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect,useCallback } from 'react';
import { sessionActions } from '../../store';
import axios from '../../services/axio-config';
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';

export default function ProfilePage() {
  const profile = useSelector(state => state.session.profile);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const loadUserStreets = useCallback(async() => {
    try {
      let response = await axios.get(`/user_profile?email=${user.email}`);
      dispatch(sessionActions.updateProfile(response.data));
    } catch (error) {
      console.log(error); 
    }
      
  },[user, dispatch]);

  useEffect(() => {
    if(!profile) {
      console.log("loading user profile");
      loadUserStreets();
    }
   
  }, [profile, loadUserStreets]);

  const createOrder = () => {

  }

  const onApprove = (data) => {
     // replace this url with your server
     return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              orderID: data.orderID,
          }),
      })
      .then((response) => response.json())
      .then((orderData) => {
          // Your code here after capture the order
          console.log(orderData);
      });
  }


  // promo code activation
  console.log(profile);

  const style = { layout: "vertical", shape: 'rect', color: 'gold',label: 'subscribe' };
  return (
    <div className='w-full h-full relative overflow-x-hidden '>
        <Navbar />
        { !profile ?
        <div className="">
          <p>Loading User Data</p>
        </div>
        : <div className="relative h-auto bg-gray-300 p-5">   


            <div className="user-info-section relative min-h-[40%] h-auto mx-auto max-w-[1080px] bg-white shadow-md p-5 rounded-md">

              <div className="absolute right-0 top-0">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {profile.subscription.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="w-full text-center p-5">
                <h4 className='font-semibold text-lg'>User Details</h4>
              </div>

              <div className="h-auto flex md:space-x-10 md:flex-row flex-col">
                <div className="">
                  <div className="streets mb-5">
                      <div className="header">
                        <h5 className='text-lg font-semibold'>User Info</h5>
                      </div>

                      <div className='px-0 grid grid-cols-2 text-gray-600'>
                        <div className="flex-1">

                          <div className="flex flex-col my-2">
                            <div className="font-semibold">Email</div>
                            <div className="">{profile.email}</div>
                          </div>

                          <div className="flex flex-col my-2">
                            <div className="font-semibold">Phone Number</div>
                            <div className="">{formatPhoneNumberIntl(profile.phone_number)}</div>
                          </div>

                        </div>
                        <div className="flex-1"></div>
                      </div>
                  </div>
               
                  <div className="streets">
                    <div className="header">
                      <h5 className='text-lg font-semibold'>My Streets</h5>
                    </div>

                    <div className='px-0 grid md:grid-cols-2 grid-cols-1'>
                      {
                        profile.streets.map(street => {
                          return (<div key={street.name} className='px-2 m-1 py-2 bg-gray-100'>
                              <span>{street.name}</span>
                          </div>)
                        })
                      }
                    </div>
                  </div>
                </div>
                

                <div className='user-actions md:mt-0 mt-5'>
                  <div className=''>
                    <div className="header">
                        <h5 className='text-lg font-semibold'>Subscription Info</h5>
                    </div>

                    <div className="text-gray-600">
                      <div className='flex w-full justify-between'>
                        <div className="flex flex-col my-2">
                          <div className="font-semibold">Text Notification</div>
                          <div className="">{profile.subscription.text_notification ? "On" : "Off"}</div>
                        </div>

                        <div className="flex flex-col my-2">
                          <div className="font-semibold">Email Notification</div>
                          <div className="">{profile.subscription.email_notification ? "On" : "Off"}</div>
                        </div>
                      </div>
                    

                      <div className="flex flex-col my-2">
                        <div className="font-semibold">Notification alerts</div>
                        <div className="my-2 text-white">
                          <span className='bg-[#0163AA] shadow-md p-1 px-3 mx-0 rounded-xl '>12hrs : {profile.subscription.twelve_hours ? "On" : "Off" }</span>
                          <span className='bg-[#0163AA] shadow-md p-1 px-3 mx-2 rounded-xl '>1hr : {profile.subscription.one_hour ? "On" : "Off" }</span>
                          
                        </div>
                      </div>


                      <div className="flex flex-col my-2">
                        <div className="font-semibold">Subscription Expiration</div>
                        <div className="">
                          
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className='my-5'>
                    <div className="header">
                        <h5 className='text-lg font-semibold'>Actions</h5>
                    </div>

                    <div className='grid grid-cols-2 w-full gap-2'>
                      <a  href="/change_password" className='p-3 shadow-md rounded-md text-white bg-[#0163AA] w-full'>
                        Change Password
                      </a>

                      <button className='p-3 shadow-md rounded-md text-white bg-[#0163AA] w-full'>
                        Update Profile
                      </button>

                      <button className='p-3 shadow-md rounded-md text-white bg-red-600 w-full'>
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                    
                    
                </div>
              </div>
            </div>

            <div className="relative payment-section md:flex-row py-10 space-x-5 flex-col flex justify-center mx-auto max-w-[1080px] bg-white shadow-md px-3 rounded-md mt-5">

              <div className="absolute top-1 p-3">
                <h4 className='font-semibold text-lg'>Payment Details</h4>
              </div>
              
              <div className="promo-code flex-1 md:max-w-[40%]">
                  <div className="card p-4">
                    <div className="card-header">
                        <h5 className="">Promo Code</h5>
                    </div>
                    <form className="form-horizontal" method="POST" id="promo-form">
                        
                      <div className="form-group px-0">
                          <label htmlFor="promo_code"></label>
                          <input 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            name="promo_code" 
                            placeholder="Your Promo code ...." 
                            pattern="[0-9a-zA-Z]{5}" 
                            maxLength="5" 
                          />
                          
                        </div>
                        
                        <div className="input-group  mt-2 submit-section w-full">
                            <button type="submit" className="text-lg p-3 rounded-md mt-2 w-full bg-[#0163AA] text-white">
                                <small>Submit</small>
                            </button>
                        </div>
                  </form>
                </div>
              </div>

              <div className="paypal flex-1 md:max-w-[40%]">
                  <div className="card p-4"> 
                    <div className="card-header">
                        <h5 className="">Debit / Credit Cards</h5>
                    </div>
                    <div className="card-body">
                      <PayPalScriptProvider options={{ clientId: "test" }}>
                        <ButtonWrapper 
                          showSpinner={false} 
                          style={style}
                          disabled={false}
                          forceReRender={[style]}
                          fundingSource={undefined}
                          createOrder={createOrder}
                          onApprove={onApprove}
                        />
                      </PayPalScriptProvider>
                    </div>
                    
                </div>
                <input type="hidden" name="csrfmiddlewaretoken" value="a5e8Gaim7V4rYIt8h4MizF7I9hDC7YgYT739DGPzcvaoR87XrlFxHWsKGFIEYocw" />
              </div>
            </div>
        </div> }
        <Footer />
    </div>
  )
}


const ButtonWrapper = ({ showSpinner, onApprove, style, createOrder }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
      <>
          { (showSpinner && isPending) && <div className="spinner" /> }
          <PayPalButtons
              style={style}
              disabled={false}
              forceReRender={[style]}
              fundingSource={undefined}
              createOrder={createOrder}
              onApprove={onApprove}
          />
      </>
  );
}