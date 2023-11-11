import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import '../../App.css'
import { AuthContext } from '../../App';

export default function LoginPage() {
    const { userInfo, setUserInfo } = useContext(AuthContext);
    console.log('userInfo------', userInfo);
    const navigate = useNavigate();
    const handleLoginSubmit = (e) => {
        e.preventDefault();

        console.log(e.target.email.value);
        console.log(e.target.password.value);
        setUserInfo({
            email: e.target.email.value,
        });
        console.log('here------')
        navigate('/home')
    }

    // useEffect(() => {
    //     navigate('/home');
    // }, [userInfo])

    return (
        <div className="text-center m-5-auto">
            <h2>Sign in to us</h2>
            <form onSubmit={handleLoginSubmit}>
                <div className="login-input-wrapper">
                    <label>Email</label>
                    <input type="email" name="email" id="email" required />
                </div>
                <div className="login-input-wrapper">
                    <label>Password</label>
                    <input type="password" name="password" id="password" required />
                </div>
                <p>
                    <button id="sub_btn" type="submit">Login</button>
                </p>
            </form>
            <footer>
                <p>First time? <Link to="/register">Create an account</Link>.</p>
            </footer>
        </div>
    )
}
