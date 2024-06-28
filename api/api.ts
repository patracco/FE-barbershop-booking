import Cookies from 'js-cookie';
import { axiosInstance } from '../api';

import axios from 'axios';
const url = 'https://alien-resolved-doe.ngrok-free.app/api';
export const host = url;

export const api = {
  get: <T>(url: string, params?: object) =>
    axiosInstance.get<T>(url, {
      headers: {
        token: Cookies.get('token'),
      },
      ...params,
    }),
  post: <T>(url: string, data: any) =>
    axiosInstance.post<T>(url, data, {
      headers: {
        token: Cookies.get('token'),
      },
    }),
  patch: <T>(url: string, data: any) =>
    axiosInstance.patch<T>(url, data, {
      headers: {
        token: Cookies.get('token'),
      },
    }),
  delete: <T>(url: string) =>
    axiosInstance.delete<T>(url, {
      headers: {
        token: Cookies.get('token'),
      },
    }),
};

export const bookingApi = axios.create({
  baseURL: url,
});

export const validateUser = (username, body) => {
  return bookingApi
    .post(`/users/${username}`, { password: body })
    .then((res) => {
      return res.data;
    });
};

export const getAllAppointments = () => {
  return bookingApi.get('/appointments').then((res) => {
    return res.data.appointments;
  });
};

export const getTimeSlotsByDate = (date) => {
  return bookingApi.get(`/appointments/${date}`).then((res) => {
    return res.data.appointments;
  });
};

export const getAppointmentByUsername = (username) => {
  return bookingApi.get(`/appointments/booked/${username}`).then((res) => {
    return res.data.appointments;
  });
};

export const postUserDetails = (body) => {
  return bookingApi.post(`/users`, body).then((res) => {
    return res.data.user;
  });
};

export const postAppointment = async (appointemntId, body) => {
  try {
    const response = await bookingApi.patch(
      `/appointments/${appointemntId}`,
      body
    );

    return response.data.appointment;
  } catch (err) {
    console.log(err);
  }
};
