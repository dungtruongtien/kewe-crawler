import React, { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from '../App';
import { me } from '../services/user.service';

export function ProtectedPage({ children }) {
	const { userInfo, setUserInfo } = useContext(AuthContext);
	const userId = localStorage.getItem('userId');

	useEffect(() => {
		if (!userInfo) {
			me().then((data) => {
				setUserInfo(data);
			});
		}
	}, [])


	if (!userId) {
		return <Navigate to="/login" />;
	} else {
		return children;
	}
}