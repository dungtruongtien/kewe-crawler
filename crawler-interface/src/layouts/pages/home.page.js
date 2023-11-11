import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../App';

export default function HomePage() {
    const { userInfo } = useContext(AuthContext);
    console.log('userInfo----', userInfo);
    return (
        <div className="text-center">
            <h1 className="main-title home-page-title">welcome to our app</h1>
            <Link to="/">
                <button className="primary-button">Log out</button>
            </Link>
        </div>
    )
}
