import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import '../../App.css'
import { AuthContext } from '../../App';
import { login } from '../../services/auth.service';

export default function LoginPage() {
    const { setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const data = await login({ email, password });
        setUserInfo({
            userId: data.userId,
        });
        navigate('/home')
    }

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
