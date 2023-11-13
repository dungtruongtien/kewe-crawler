import React from 'react';
import { Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from '../App';

export function PreventAuthenticatedPage({ children }) {
	const { userInfo } = useContext(AuthContext);
	const userId = localStorage.getItem('userId');
	
	if (userInfo && userId) {
		return <Navigate to="/home" />;
	}
	return children;
}