export const apiRoutes = {
  login: '/users/login',
  logout: '/users/logout',
  signup: '/users/signup',
  subs: '/subs',
  session: '/subs/session',
  //   getTokenByPassword: '/api/getTokenByPassword',
  // getProfile: '/users/me',
  getUser: '/users/:id',
  verifyEmail: 'users/verify',
  sessions: '/sessions',
  bookings: '/bookings',
  events: '/events',
  users: '/users',
  sms: '/sms',
  //   getUserList: '/api/getUserList',
  //   appointment: '/api/appointment/:id',
  //   getServices: '/api/getServices',
  //   getCarDetail: '/api/getCarDetail/:id',
  //   getInsurance: '/api/getInsurance/:id',
  //   job: '/api/job/:id?',
};

export const pageRoutes = {
  main: '/',
  auth: '/auth',
  appointment: '/appointment/:id',
};
