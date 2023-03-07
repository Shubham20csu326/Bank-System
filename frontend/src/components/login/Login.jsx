import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const commands = [
        {
            command: 'account number is *',
            callback: (accountNumber) => setAccount(accountNumber),
        },
        {
            command: 'password is *',
            callback: (password) => setPassword(password),
        },
    ];
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition({ commands });
    useEffect(() => {

        const handleKeyDown = (event) => {
            if (event.keyCode === 13) {
                login();
            }
            if (event.keyCode === 32 && event.target.tagName !== 'INPUT') {
                event.preventDefault(); // prevent the spacebar from scrolling the page
                if (!listening) {
                    SpeechRecognition.startListening({ language: 'en-IN' });
                } else {
                    SpeechRecognition.stopListening();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [listening]);

    const login = async () => {
        const data = {
            account: account,
            password: password.replace(/\s+/g, '')
        }
        console.log(data)
        const res = await axios.post('http://localhost:8080/auth/login', data);
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);

            setAccount('');
            setPassword('');
            navigate('/user');
        }
        else {
            setAccount('');
            setPassword('');
        }

    };


    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
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
                        onChange={(e) => setPassword(e.target.value.replace(/\s+/g, ''))}
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
            <p>Microphone: {listening ? <i class="fa-solid fa-microphone"></i> : <i class="fa-solid fa-microphone-slash"></i>}</p>
            <p>{transcript}</p>
        </section>
    );
};

export default Login;
