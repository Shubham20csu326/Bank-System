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
            callback: (accountNumber) => {
                setAccount(accountNumber)
                speak(`Account Number is ${accountNumber}`)
            },
        },
        {
            command: 'password is *',
            callback: (password) => {
                setPassword(password)
                speak(`Password is ${password}`)
            },
        },
        {
            command: 'reset',
            callback: () => {
                resetTranscript();
                setAccount('');
                setPassword('');
                speak("Data has been reset. Please enter your account number and password again.");
            },
        },
    ];
    const speak = (message) => {
        const speechSynthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        speechSynthesis.speak(utterance);
    }
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

    const login = async (e) => {
        if (e) {
            e.preventDefault()
        }
        const data = {
            account: account,
            password: password.replace(/\s+/g, '')
        }
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
            <form autoComplete="off" onSubmit={login}>
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
                <button type="submit" className="btn btn-primary btn-block mb-4" >
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