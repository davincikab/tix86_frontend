/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useEffect,useCallback, useState } from 'react';
import { sessionActions } from '../../store';
import axios from '../../services/axio-config';
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import VerificationForm from './VerificationForm';
import Modal from '../../components/Modal';
import { update } from 'lodash';

export default function ProfilePage() {
  const profile = useSelector(state => state.session.profile);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState(null);
  const [codeSent, setCodeSent] = useState({
    isSuccessful:false,
    error:"",
    isLoading:false
  });


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
      loadUserStreets();
    }
   
  }, [profile, loadUserStreets]);

  const createSubscription = async(data, actions) => {
    return actions.subscription.create({
      'plan_id': 'P-8M253739RD267825AL4PR2CY'
    });
  } 

  const onCancel = (data) => {
    // redirect to cancel 
    window.location.assign("/payment_cancelled/");
    console.log(data);
  }

  const onError = (error) => {
    // display the error message on snackbar 
    console.log(error);
    alert(error);
  }

  const onApprove = async (data) => {
    console.log(data);
     // replace this url with your server
     let userData = {
      'subscription_id':data.subscriptionID,
      'uuid':'',
      'userId':user.id,
      'is_active':true,
      'subscription_date':new Date().toISOString()
    };

    try {
      let response = await axios.post("/process_subscription_payment", {...userData});
      dispatch(sessionActions.updateProfile({...profile, subscription:response.data }));
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      let response = await axios.post('/activate_subscription_by_couponcode', {code:promoCode, userId:user.id });

      let { subscription } = response.data;
      dispatch(sessionActions.updateProfile({...profile,subscription}))      
    } catch (error) {
      console.log(error);
      if(error.status == 500) {
        setError(error.response.data.error);
      }
      
    }
  }

  const sendVerificationCode = async () => {
    setCodeSent(prevState => ({...prevState, isLoading:true}))
    try {
      let response = await axios.post("/send_phone_number_verification_code", { phone_number:user.phone_number });
      console.log(response);
      setCodeSent(prevState => ({...prevState, isSuccessful:true}));
      
    } catch (error) {
      console.log(error);
      if(error.status == 500) {
        let err = error.response.data.error;
        

        if(err && err.includes("Alpha sender not configured")) {
          console.log(err);
          setCodeSent({
            ...codeSent, 
            error:"Invalid Phone Number or Non US Phone Number", 
            isSuccessful:false 
          })
        } else {
          setCodeSent({
            ...codeSent, 
            error:"Internal Server Error", 
            isSuccessful:false 
          })
        }
        
        
      }
      
    } finally {
      setCodeSent(prevState => ({...prevState, isLoading:false}))
    }
  }


  // promo code activation
  console.log(profile);

  const style = { layout: "vertical", shape: 'rect', color: 'gold',label: 'subscribe' };
  return (
    <div className='w-full h-full relative overflow-x-hidden '>
        <Navbar />
        { !profile ?
        <div className="relative h-auto md:bg-gray-300 p-5 min-h-[80vh]">
          <p>Loading User Data</p>
        </div>
        : <div className="relative h-auto md:bg-gray-300 p-5 min-h-[80vh]">   


            <div className="user-info-section relative min-h-[40%] h-auto mx-auto max-w-[1080px] bg-white shadow-md p-5 rounded-md">

              <div className="absolute right-0 top-0">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {profile.subscription && profile?.subscription.is_active ? "Active" : "Inactive"}
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

                  { !user.is_phone_number_verified && <div className="verify_phone_number">
                    <div className="header">
                      <h5 className='text-lg font-semibold'>Verify Phone Number</h5>
                    </div>

                    <div className="verify">
                      <button onClick={sendVerificationCode} className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#2c6353]/60 disabled:border-[#2c6353]/60 disabled:text-[#2c6353]/60 py-2 px-4 text-white cursor-pointer'>
                        { codeSent.isLoading ? "Sending" : "Send Code"}
                      </button>

                      { !codeSent.isSuccessful && <div className='text-red-200'>{codeSent.error}</div> }
                    </div>

                    { codeSent.isSuccessful ? <Modal isOpen={true} activeTab={""}>
                      <VerificationForm />
                    </Modal> : "" }
                    
                    
                    
                  </div> }
               
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

                    { profile.subscription ? <div className="text-gray-600">
                      <div className='flex w-full justify-between'>
                        <div className="flex flex-col my-2">
                          <div className="font-semibold">Text Notification</div>
                          <div className="">{profile?.subscription.text_notification ? "On" : "Off"}</div>
                        </div>

                        <div className="flex flex-col my-2">
                          <div className="font-semibold">Email Notification</div>
                          <div className="">{profile?.subscription.email_notification ? "On" : "Off"}</div>
                        </div>
                      </div>
                    

                      <div className="flex flex-col my-2">
                        <div className="font-semibold">Notification alerts</div>
                        <div className="my-2 text-white">
                          <span className='bg-[#0163AA] shadow-md p-1 px-3 mx-0 rounded-xl '>12hrs : {profile?.subscription.twelve_hours ? "On" : "Off" }</span>
                          <span className='bg-[#0163AA] shadow-md p-1 px-3 mx-2 rounded-xl '>1hr : {profile?.subscription.one_hour ? "On" : "Off" }</span>
                          
                        </div>
                      </div>


                      <div className="flex flex-col my-2">
                        <div className="font-semibold">Subscription Expiration</div>
                        <div className="">
                          
                        </div>
                      </div>

                    </div> : <div>Kindly Select Street and Update Subcription Info</div>}
                  </div>

                  <div className='my-5'>
                    <div className="header">
                        <h5 className='text-lg font-semibold'>Actions</h5>
                    </div>

                    <div className='grid md:grid-cols-2 w-full gap-2 flex-col md:flex-row'>
                      <a  href="/change_password" className='p-3 shadow-md rounded-md text-white bg-[#0163AA] w-full text-center'>
                        Change Password
                      </a>

                      <a href="/profile_update" className='p-3 shadow-md rounded-md text-white bg-[#0163AA] w-full text-center'>
                        Update Profile
                      </a>

                      <button className='p-3 shadow-md rounded-md text-white bg-red-600 w-full hidden'>
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                    
                    
                </div>
              </div>
            </div>

            { (profile.subscription && !profile?.subscription.is_active) && <div className="relative payment-section md:flex-row py-10 space-x-5 flex-col flex justify-center mx-auto max-w-[1080px] bg-white shadow-md px-3 rounded-md mt-5">

              <div className="absolute top-1 p-3">
                <h4 className='font-semibold text-lg'>Payment Details</h4>
              </div>
              
              <div className="promo-code flex-1 md:max-w-[40%]">
                  <div className="card p-4">
                    <div className="card-header">
                        <h5 className="">Promo Code</h5>
                    </div>
                    <form className="form-horizontal" method="POST" id="promo-form" onSubmit={handleSubmit}>
                        
                      <div className="form-group px-0">
                          <label htmlFor="promo_code"></label>
                          <p className='text-red-400 text-sm'>
                            {error}
                          </p>

                          <input 
                            type="text" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            name="promo_code" 
                            placeholder="Your Promo code ...." 
                            pattern="[0-9a-zA-Z]{5}" 
                            maxLength="5" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
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

                    {/* <button 
                      className='bg-blue-400 text-white px-3 py-1 rounded-md my-2'
                      onClick={() => onApprove(
                          {
                            "facilitatorAccessToken": "A21AAObzyvAqDVX8kMHM8c21hNqJTG_yB6RM1nnbpf1r411M7qFclHutTtkNeGDmxxzjn8c48PjMDybZivnyUyi_u9XMb052w",
                            "orderID": "8N9194436C556074L",
                            "paymentSource": "paypal",
                            "subscriptionID": "I-6XACNH7GHH95"
                          }
                        )}
                    >
                    Update Subscriptions
                    </button> */}
                    <div className="card-body">
                      <PayPalScriptProvider 
                        options={{ 
                            intent:'subscription', 
                            // clientId:'AXglID5g1MCLQUPiQ3QR8uYdzQSxsNoZO0kJugdJre6GPvc7S1-JosMcKU5n9QZuPPWk3yPUQSWgxxpE',
                            clientId:"AYNY1EZahVCYNWDa_L5MLRTO3IOqE4V-vJfiYWFuX7JOMbDUDvJIs-YLDFefM0_mK1pGxDrxDGlRE-Xw", 
                            vault:true 
                          }}
                        >
                        <ButtonWrapper 
                          showSpinner={false} 
                          style={style}
                          disabled={false}
                          forceReRender={[style]}
                          fundingSource={undefined}
                          // createOrder={createOrder}
                          createSubscription={createSubscription}
                          onApprove={onApprove}
                          onCancel={onCancel}
                          onError={onError}
                          
                        />
                      </PayPalScriptProvider>
                    </div>
                    
                </div>
                <input type="hidden" name="csrfmiddlewaretoken" value="a5e8Gaim7V4rYIt8h4MizF7I9hDC7YgYT739DGPzcvaoR87XrlFxHWsKGFIEYocw" />
              </div>
            </div> }
        </div> }
        <Footer />
    </div>
  )
}


const ButtonWrapper = ({ showSpinner, onApprove, onError, onCancel, style, createSubscription }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
      <>
          { (showSpinner && isPending) && <div className="spinner" /> }
          <PayPalButtons
            style={style}
            disabled={false}
            forceReRender={[style]}
            fundingSource={undefined}
            createSubscription={createSubscription}
            onCancel={onCancel}
            onError={onError}
            onApprove={onApprove}
          />
      </>
  );
}