import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';

function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // this will get the token from cookie and send it to backend
        const response = await axios.get(`${serverUrl}/api/user/me`, {
          withCredentials: true,
        });
        console.log(response.data);
        if (response.data.user) {
          dispatch(setUserData(response.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentUser();
  }, []);
}

export default useGetCurrentUser;
