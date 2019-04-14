import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { SET_CURRENT_USER, GET_ERRORS } from './types';

export const registerUser = (newUser, history) => dispatch => {
  axios
    .post('/api/users/register', newUser)
    .then(res => {
      console.log(res.data);
      history.push('/login');
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const loginUser = (user, history) => dispatch => {
  axios
    .post('/api/users/login', user)
    .then(res => {
      const { token } = res.data;
      console.log('token :' + token);

      //store token in localstorage of browser
      localStorage.setItem('jwtToken', token);

      //set token to auth header
      setAuthToken(token);
      //decode token to  get user data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logoutUser = () => dispatch => {
  //remove the token from localstorage
  localStorage.removeItem('jwtToken');
  //remove auth header for future requests
  setAuthToken(false);
  //set the current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
