import React from 'react';

import HomePage from "../layouts/pages/HomePage";

export const protectedRoutes = [
  {
    component: <HomePage />,
    path: '/home',
    key: 'home'
  }
]