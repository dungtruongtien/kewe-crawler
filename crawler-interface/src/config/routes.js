import React from 'react';

import HomePage from "../layouts/pages/home.page";
import RegisterPage from '../layouts/pages/register.page';
import LoginPage from '../layouts/pages/login.page';

export const protectedRoutes = [
  {
    component: <HomePage />,
    path: '/home',
    key: 'home'
  }
]

export const preventAuthenticatedRoutes = [
  {
    component: <LoginPage />,
    path: '/login',
    key: 'login'
  },
  {
    component: <RegisterPage />,
    path: '/register',
    key: 'register'
  }
]