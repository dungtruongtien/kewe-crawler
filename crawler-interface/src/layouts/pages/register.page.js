import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/user.service';

import '../../App.css'
import { useToasts } from 'react-toast-notifications';

export default function RegisterPage() {
    const { addToast } = useToasts();
    const navigate = useNavigate();

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        try {
            await register({ email, password });
            addToast('Register user successfully', { appearance: 'success', autoDismiss: true });
            navigate('/login')
        } catch (err) {
            console.log('errr---', err);
            addToast(err.error.response.data.message, { appearance: 'error', autoDismiss: true });
        }
    }

    return (
        <div className="text-center m-5-auto">
            <h2>Join us</h2>
            <h5>Create your personal account</h5>
            <form onSubmit={handleRegisterSubmit}>
                <p>
                    <label>Email address</label><br />
                    <input type="email" name="email" required />
                </p>
                <p>
                    <label>Password</label><br />
                    <input type="password" name="password" required />
                </p>
                <p>
                    <button id="sub_btn" type="submit">Register</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )

}
