import Map, {Source, Layer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import GeocoderControl from './GeocoderControl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState, useCallback, useRef} from 'react';
import axios from '../../services/axio-config';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BiStreetView } from 'react-icons/bi';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import bbox from '@turf/bbox';
import { sessionActions } from '../../store';
import { useNavigate } from 'react-router-dom';
import { map } from 'framer-motion/client';

let accessToken = 'pk.eyJ1IjoicmFtejg1OCIsImEiOiJjazl1N3ZxYnUxa2dlM2dtb3ozemhtZWJ2In0.c7Pc5LCE0rvGoJ6hZYEftg';
let bounds = [
    [-117.368317,32.650938], // Southwest coordinates
    [-117.020874,32.938386] // Northeast coordinates
];

const MainPage = () => {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector(state => state.session.profile);
  const user = useSelector(state => state.session.user);

  let [mapZoomed, setMapZoomed] = useState(false); 
  let [map_bounds, setMapBounds] = useState(bounds); 
  const [streets, setStreets] = useState(userProfile ? userProfile.streets : []);
  const [state, setState] = useState(
    (userProfile && userProfile.subscription) ? userProfile.subscription :
    {
      text_notification:false,
      email_notification:false,
      twelve_hours:true,
      one_hour:false,
    }
  );

  const zoomToBounds = useCallback(() => {
    console.log(streets);
    // return;
      if(streets.length) {
        let bounds = streets.map(street => JSON.parse(street.bounds));
        console.log(bounds);
        bounds = bounds.map(bound => [bound.slice(0,2), bound.slice(2,)]).flat(1);
        

        let mapBounds = new mapboxgl.LngLatBounds(bounds[0], bounds[0]);
        bounds.forEach(bound => {
          mapBounds.extend(bound);
        });

        setMapBounds(mapBounds);
        
        if(mapRef.current) {
          mapRef.current.fitBounds(mapBounds,{padding:50});
          setMapZoomed(true);
        }
        // console.log(bounds);
      }
      
  }, [streets])

  const loadUserStreets = useCallback(async() => {
    try {
      let response = await axios.get(`/user_profile?email=${user.email}`);
      dispatch(sessionActions.updateProfile(response.data));
      // zoomToBounds(response.data.streets);

      // if()
      setState(response.data.subscription || state);
      setStreets(response.data.streets);
      // dispatch(sessionActions.updateUserStreets(userInfo));
    } catch (error) {
      console.log(error); 
    }
      
  },[user, dispatch, state]);

  useEffect(() => {
    console.log("Zoome end: ", mapZoomed);
      if(!mapZoomed) {
        zoomToBounds();
      }
  }, [mapRef, zoomToBounds, mapZoomed])

  useEffect(() => {
    if(!userProfile) {
      console.log(userProfile);
      loadUserStreets();
    }
   
  }, [userProfile, loadUserStreets]);

  const handleClick = (event) => {
    if(event.features.length) {
      let feature  = event.features[0];

      if(streets.find(street => street.SL == feature.properties.SL)) {
        removeStreet(feature.properties);
        return;
      }

      if(streets.length >= 4) {
        alert("Maximum street count reached");
      } else {
        let bounds = bbox(feature);
        let street = feature.properties;

        let info = {
          'userId':user.id,
          'name':street['SL'], 
          'dl1_day':street['DL1 DAY'], 
          'dl1_time':street['DL1 TIME'], 
          'dl2_day':street['DL2 DAY'], 
          'dl2_time':street['DL2 TIME'], 
          'address':street['SL'], 
          'bounds':bounds
        };

        setStreets(prevState => [...prevState, {...info }]);
      }

    }
  }

  const handleOnChange = (event) => {
    let { checked, id} = event.target;

    setState(prevState => ({...prevState, [id]:checked }));
  }

  const removeStreet = (entry) => {
    let selected_Streets = [...streets];
    selected_Streets = selected_Streets.filter(street=> street.name !== entry.name);
    setStreets(selected_Streets);
  }

  const onSubmit = async () => {
      try {
        let { text_notification, email_notification, twelve_hours, one_hour } = state;
        let response = await axios.post("/update_streets", {streets, user});    
        
        if(!response) {
          navigate("/signin");
        }
        let sub_response = await axios.post(
          "/update_subscription", 
          {text_notification, email_notification, twelve_hours, one_hour, user}
        );

        console.log(response);
        console.log(sub_response);

        dispatch(sessionActions.updateProfile({
          ...userProfile,
          streets:response.data.streets,
          subscription:sub_response.data
        }));

      } catch (error) {
        console.log(error);
      }
  }

  // console.log(streets);
  console.log(streets);
  // console.log(mapRef, mapZoomed);
  let { text_notification, email_notification, twelve_hours, one_hour } = state;
  
  return (
    <div className='w-full h-full relative overflow-x-hidden'>
      <Navbar />
      <div className="relative">      
        <Map
            mapboxAccessToken={accessToken}
            mapLib={import('mapbox-gl')}
            initialViewState={{
              longitude: -117.191,
              latitude: 32.794,
              zoom: 10,
              bounds:map_bounds
            }}
            style={{width: "100vw", height: "90vh"}}
            mapStyle='mapbox://styles/ramz858/ckbx684hi1m4m1inxh6sdnxwv'
            maxBounds={bounds}
            interactive={true}
            minZoom={10}
            maxZoom={17.9}
            maxPitch={0}  
            onClick={handleClick}
            ref={mapRef}
            interactiveLayerIds={['route']}
        >

          <Source type="vector" url="mapbox://ramz858.ckbrddrjh00u222o5ufdwlt2r-6mw1r" buffer={500}>
            <Layer {...routeStyle}> </Layer>
            <Layer {...routeSelectedStyle} filter={['in', ['get', 'SL'], streets.map(str => str.name).join(",")]}> </Layer>
          </Source> 

            {/* selected routes */}
          {/* <Source type="vector" url="mapbox://ramz858.ckbrddrjh00u222o5ufdwlt2r-6mw1r" buffer={500}>
            <Layer {...routeStyle}> </Layer>
            <Layer {...routeSelectedStyle} filter={['in', ['get', 'SL'], '']}> </Layer>
          </Source>          */}

          <GeocoderControl mapboxAccessToken={accessToken} position="top-left" />
        </Map>
     
      <div className="absolute bg-white z-10 md:top-0 right-0 md:bottom-5 md:m-5 rounded-[5px] text-black w-[300px] shadow-lg overflow-y-auto m-0 top-[50vh] bottom-0">
        <h6 className="text-center mx-0 font-bold capitalize bg-gray-100 p-4">Set your street sweeping alerts</h6>
        <hr className='my-1'/>
        <div className="px-4 py-2">
          {
            streets.map(entry => {

              return (
                <div key={entry.name} className="w-full my-2 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <div className="relative inline-flex items-center justify-between w-full px-4 py-2 text-sm font-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                      <BiStreetView className=''/>
                      <span className='mx-2 text-sm'>{entry.name}</span>
                      <button onClick={() => removeStreet(entry)}> <FaTimes /></button>
                  </div>
                </div>
              )
            })
          }
          
        </div>

        <div className="subescription-option px-4 py-2">
          <h6 className="text-medium">Subscription Option</h6>
          <hr className='my-2'/>

          <div className="my-3">
            <label className="inline-flex items-center mb-0 cursor-pointer" htmlFor='text_notification'>
              <input type="checkbox" className="sr-only peer"  id='text_notification' checked={text_notification} onChange={handleOnChange}/>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0163AA]"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Text Notification</span>
            </label>
          </div>

          <div className="my-1">
            <label className="inline-flex items-center mb-0 cursor-pointer" htmlFor='email_notification'>
              <input type="checkbox" value="" className="sr-only peer" id='email_notification' checked={email_notification} onChange={handleOnChange}/>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0163AA]"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Email Notification</span>
            </label>
          </div>

          <h5>Notify In</h5>

          <div className="my-1">
            <label className="inline-flex items-center mb-0 cursor-pointer" htmlFor='twelve_hours'>
              <input type="checkbox" value="" className="sr-only peer" id='twelve_hours' checked={twelve_hours} onChange={handleOnChange}/>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0163AA]"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Twelve Hours</span>
            </label>
          </div>

          <div className="my-1">
            <label className="inline-flex items-center mb-0 cursor-pointer" htmlFor='one_hour'>
              <input type="checkbox" value="" className="sr-only peer" id='one_hour' checked={one_hour} onChange={handleOnChange}/>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0163AA]"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">One Hour</span>
            </label>
          </div>


          <button
              onClick={onSubmit}
              className='my-2 rounded-[30px] font-bold bg-[#0163aa] disabled:bg-[#0163aa]/60 disabled:border-[#2c6353]/60 disabled:text-[#2c6353]/60  p-3  w-full text-white cursor-pointer'
              disabled={!streets.length}
          >
             Update
          </button>
        </div>
       

      </div>

      </div>

      <Footer></Footer>
    </div>
  )
}

const routeStyle = {
  'id': 'route',
  'type': 'line',
  'source': 'route',
  'source-layer': 'csvnew',
  'layout': {
      'line-join': 'round',
      'line-cap': 'round'
      
  },
  'paint': {
      'line-color': '#888',
      'line-width': 45,
      'line-opacity': 0  
  }
}

const routeSelectedStyle = {
  "id": "selectedRoad",
  "type": "line",
  "source": "selectedRoad",
  'source-layer': 'csvnew',
  "layout": {
      "line-join": "round",
      "line-cap": "round"
  },
  "paint": {
      "line-color": "yellow",
      "line-width":8,
      "line-opacity": .8
      
  }
}
export default MainPage;