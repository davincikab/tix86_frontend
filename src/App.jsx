import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { validateJwtToken } from './services/utils';
import { useEffect } from 'react';


const App = () => {
  const navigate = useNavigate();

  // const newServer = useSelector((state) => state.session.server.newServer);
  // const initialized = useSelector((state) => !!state.session.user);
  const user = useSelector((state) => state.session.user);
  const initialized = validateJwtToken(localStorage.getItem("accessToken"));
  console.log(initialized, user);

  useEffect(() => {
    if(!initialized) {
      navigate("/signin");
    } else {
      // loadData()
    }

  }, [initialized, navigate]);
  

  return !initialized ? (<div className='text-black'>Loading...</div>) : (
    <>
    
      <div className="page w-full h-full">
        <Outlet />
      </div>

    </>
  );
};

export default App;
