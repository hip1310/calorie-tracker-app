import './App.css';
import { useEffect, useState } from 'react';
import Routes from './routes';
import { axiosAPI } from './services';

const App = () => {
  const [user,setUserInfo] = useState()
  useEffect(() => {
    // Get User details based on pre-defined token in env
    setUserInfo()
     axiosAPI.get('/v1/get-user-details')
      .then(res => {
        const userInfo = res.data.data;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUserInfo(userInfo)
      })
  }, []);

  return (
    <>
      <Routes user={user}/>
    </>
  );
}

export default App;
