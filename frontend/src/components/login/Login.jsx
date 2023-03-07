import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    const handleKeyPress = (event) => {
        if (event.keyCode === 13) {
            login();
        }
    };

    const login = async () => {
        const data = {
            account,
            password,
        };
        try {
            const response = await axios.post('http://localhost:8080/auth/login', data);
            localStorage.setItem('token', response.data.token);
            setAccount('');
            setPassword('');
            navigate('/user');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section>
            <h1>Banking Login</h1>
            <form autoComplete="off">
                {/* Account input */}
                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="form2Example1"
                        className="form-control"
                        autoComplete="off"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form2Example1">
                        Account Number
                    </label>

                    <div className="form-notch">
                        <div className="form-notch-leading" style={{ width: '9px' }} />
                        <div className="form-notch-middle" style={{ width: '64.8px' }} />
                        <div className="form-notch-trailing" />
                    </div>
                </div>
                {/* Password input */}
                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="form2Example2"
                        className="form-control"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <label className="form-label" htmlFor="form2Example2">
                        Password
                    </label>

                    <div className="form-notch">
                        <div className="form-notch-leading" style={{ width: '9px' }} />
                        <div className="form-notch-middle" style={{ width: '64.8px' }} />
                        <div className="form-notch-trailing" />
                    </div>
                </div>
                {/* Submit button */}
                <button type="button" className="btn btn-primary btn-block mb-4" onClick={login}>
                    Sign in
                </button>
                {/* Register buttons */}
                <div className="text-center">
                    <button style={{ fontSize: '2rem' }} type="button" className="btn btn-link btn-floating mx-1">
                        <i className="fa-solid fa-camera"></i>
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Login;
