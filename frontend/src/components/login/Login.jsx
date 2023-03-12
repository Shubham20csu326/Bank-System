import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { AiOutlineAudio } from 'react-icons/ai';
import { BsFillMicMuteFill } from 'react-icons/bs';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
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
            command: 'sign in',
            callback: () => {
                login()
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
        const res = await axios.post('https://bankingproject.vercel.app/auth/login', data);
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
    const googleAuth = async (value) => {
        var data = {
            "email": value
        }
        let res = await axios.post('https://bankingproject.vercel.app/auth/checkemail', data)
        if (res.data.success) {
            console.log(res.data.message)
            localStorage.setItem('token', res.data.token);
            navigate('/user')

        }
        else {
            console.log(res.data.message)
        }
    }
    return (
        <section>
            <div className="microphone-btn" >
                {listening ? <AiOutlineAudio size={30} /> : <BsFillMicMuteFill size={30} />}
            </div>
            <h1>Banking Login</h1>
            <form autoComplete="off" onSubmit={login}>
                {/* Account input */}
                <div className="form-group">
                    {/* <label for="exampleInputPassword1">Account Number</label> */}
                    <input type="text" className="form-control" id="exampleInputPassword1" placeholder="Account Number" autoComplete="off"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)} />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.replace(/\s+/g, ''))} />
                </div>
                <button type="submit" className="btn btn-primary btn-block mb-4" >
                    Sign in
                </button>
                <h5>OR</h5>
                <div className="text-center" style={{ display: 'flex', justifyContent: 'center' }}>

                    <GoogleOAuthProvider clientId="873940242342-bs7kjgprr3ctnq1s4pgqjeemvm10t6n7.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                var data = jwt_decode(credentialResponse.credential);
                                googleAuth(data.email);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </GoogleOAuthProvider>

                </div>
            </form>
            <p>{transcript}</p>
        </section >
    );
};

export default Login;