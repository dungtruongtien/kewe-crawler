import React, { useEffect } from 'react';

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from '../App';
import { me } from '../services/user.service';

export function ProtectedPage({ children }) {
	const { userInfo, setUserInfo } = useContext(AuthContext);
	const userId = localStorage.getItem('userId');
	console.log('userInfo in ProtectedPage--------', userInfo, userId);

	useEffect(() => {
		if (!userInfo) {
			console.log('run APP')
			me().then((data) => {
				setUserInfo(data);
			});
		}
	}, [])


	if (!userInfo && !userId) {
		return <Navigate to="/login" />;
	} else {
		return children;
	}
}