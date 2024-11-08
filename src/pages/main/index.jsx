import Map, {Source, Layer } from 'react-map-gl';
import GeocoderControl from './GeocoderControl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { BiStreetView } from 'react-icons/bi';
import { FaCross, FaTimes } from 'react-icons/fa';

let accessToken = 'pk.eyJ1IjoicmFtejg1OCIsImEiOiJjazl1N3ZxYnUxa2dlM2dtb3ozemhtZWJ2In0.c7Pc5LCE0rvGoJ6hZYEftg';
let bounds = [
    [-117.368317,32.650938], // Southwest coordinates
    [-117.020874,32.938386] // Northeast coordinates
];

let userData = ['3800-3999 37TH ST_283', '3800-3999 CHEROKEE AV_674', '3800-3999 36TH ST_275', '3800-3999 WILSON AV_2640'];

const MainPage = () => {

  const loadUserStreets = () => {

  }

  useEffect(() => {
    loadUserStreets()
  })

  const handleClick = (event) => {
    console.log(event);

    if(event.features) {
      console.log(event.features);
    }
  }

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
              zoom: 10
            }}
            style={{width: "100vw", height: "90vh"}}
            mapStyle='mapbox://styles/ramz858/ckbx684hi1m4m1inxh6sdnxwv'
            maxBounds={bounds}
            interactive={true}
            minZoom={10}
            maxZoom={17.9}
            maxPitch={0}  
            onClick={handleClick}
            interactiveLayerIds={['route']}
        >

          <Source type="vector" url="mapbox://ramz858.ckbrddrjh00u222o5ufdwlt2r-6mw1r" buffer={500}>
            <Layer {...routeStyle}> </Layer>
            <Layer {...routeSelectedStyle} filter={['in', ['get', 'SL'], '']}> </Layer>
          </Source>         

          <GeocoderControl mapboxAccessToken={accessToken} position="top-left" />
        </Map>
     
      <div className="absolute bg-white z-10 p-4 top-0 right-0 bottom-5 m-5 rounded-[5px] text-black w-[300px] shadow-lg">
        <h6 className="text-center mx-2 font-bold capitalize bg-gray-100 p-2">Set your street sweeping alerts</h6>
        <hr className='my-2'/>
        <div className="py-4">
          {
            userData.map(entry => {

              return (
                <div key={entry} className="w-full my-2 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <div className="relative inline-flex items-center justify-between w-full px-4 py-2 text-sm font-sm border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                      <BiStreetView className=''/>
                      <span className='mx-2 text-sm'>{entry}</span>
                      <button> <FaTimes /></button>
                  </div>
                </div>
              )
            })
          }
          
        </div>

        <div className="subescription-option mt-5">
          <h6 className="text-medium">Subscription Option</h6>
          <hr className='my-2'/>

          <div className="my-3">
            <label className="inline-flex items-center mb-0 cursor-pointer" htmlFor='text-notification'>
              <input type="checkbox" value="" className="sr-only peer"  id='text-notification'/>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Text Notification</span>
            </label>
          </div>

          <div className="my-1">
            <label className="inline-flex items-center mb-0 cursor-pointer" htmlFor='email-notification'>
              <input type="checkbox" value="" className="sr-only peer" id='email-notification'/>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Email Notification</span>
            </label>
          </div>

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