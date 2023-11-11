import React from 'react';

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../App';

export function ProtectedPage({ children }) {
	const { userInfo } = useContext(AuthContext);
	console.log('userInfo in ProtectedPage--------', userInfo);

	if (!userInfo) {
		return <Navigate to="/login" />;
	} else {
		return children;
	}
}