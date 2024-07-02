import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../api';

// Helper function to get the token from AsyncStorage
const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const api = {
  get: async <T>(url: string, params?: object) => {
    const token = await getToken();
    return axiosInstance.get<T>(url, {
      headers: {
        token: token,
      },
      ...params,
    });
  },
  post: async <T>(url: string, data: any) => {
    const token = await getToken();
    return axiosInstance.post<T>(url, data, {
      headers: {
        token: token,
      },
    });
  },
  patch: async <T>(url: string, data: any) => {
    const token = await getToken();
    return axiosInstance.patch<T>(url, data, {
      headers: {
        token: token,
      },
    });
  },
  delete: async <T>(url: string, data: {}) => {
    const token = await getToken();
    return axiosInstance.delete<T>(url, {
      headers: {
        token: token,
      },
      data,
    });
  },
};

// export const bookingApi = axios.create({
//   baseURL: url,
// });

// export const validateUser = (username, body) => {
//   return bookingApi
//     .post(`/users/${username}`, { password: body })
//     .then((res) => {
//       return res.data;
//     });
// };

// export const getAllAppointments = () => {
//   return bookingApi.get('/appointments').then((res) => {
//     return res.data.appointments;
//   });
// };

// export const getTimeSlotsByDate = (date) => {
//   return bookingApi.get(`/appointments/${date}`).then((res) => {
//     return res.data.appointments;
//   });
// };

// export const getAppointmentByUsername = (username) => {
//   return bookingApi.get(`/appointments/booked/${username}`).then((res) => {
//     return res.data.appointments;
//   });
// };

// export const postUserDetails = (body) => {
//   return bookingApi.post(`/users`, body).then((res) => {
//     return res.data.user;
//   });
// };

// export const postAppointment = async (appointemntId, body) => {
//   try {
//     const response = await bookingApi.patch(
//       `/appointments/${appointemntId}`,
//       body
//     );

//     return response.data.appointment;
//   } catch (err) {
//     console.log(err);
//   }
// };
