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
                event.preventDefault();
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
                <div class="form-group">
                    {/* <label for="exampleInputPassword1">Account Number</label> */}
                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Account Number" autoComplete="off"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)} />
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.replace(/\s+/g, ''))} />
                </div>
                <button type="button" className="btn btn-primary btn-block mb-4" onClick={login}>
                    Sign in
                </button>
                <div className="text-center">
                    <button style={{ fontSize: '2rem' }} type="button" className="btn btn-link btn-floating mx-1">
                        <i class="fa-brands fa-google-plus-g"></i>
                    </button>
                </div>
            </form>
            <p>Microphone: {listening ? <i class="fa-solid fa-microphone"></i> : <i class="fa-solid fa-microphone-slash"></i>}</p>
            <p>{transcript}</p>
        </section>
    );
};

export default Login;
