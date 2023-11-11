import React from 'react';

import HomePage from "../layouts/pages/home.page";

export const protectedRoutes = [
  {
    component: <HomePage />,
    path: '/home',
    key: 'home'
  }
]