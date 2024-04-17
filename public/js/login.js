/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios.post(
      '/api/v1/users/login',
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.error('Error while logging in💥: ', err.response);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout', {
      withCredentials: true,
    });

    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.error('Error while logging out💥: ', err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
