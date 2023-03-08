import React, { useEffect, useState } from 'react';
import './UserPage.css';
import axios from 'axios';
import { AiOutlineAudio } from 'react-icons/ai';
import { BsFillMicMuteFill } from 'react-icons/bs';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import numberToWords from 'number-to-words';
import jwt_decode from 'jwt-decode';

const UserPage = () => {
    const [profile, setProfile] = useState([]);
    const [withdraw, setWithdraw] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [balance, setBalance] = useState(0);
    const [id, setId] = useState('');

    const loadProfile = async () => {
        const token = localStorage.getItem('token');
        const dtoken = jwt_decode(token);
        let res = await axios.post('http://localhost:8080/auth/getuser/' + dtoken.userId);
        setProfile([res.data.value])
        setBalance(res.data.value.balance)
        setId(res.data.value._id)
    };

    useEffect(() => {

        loadProfile();
    }, []);

    const depositbutton = async () => {

        const dbalance = balance + parseInt(deposit);
        var data = {
            balance: dbalance,
        };
        let res = await axios.put('http://localhost:8080/auth/editbalance/' + id, data);
        if (res.data.success) {
            setBalance(dbalance);
            setDeposit(0);
        };
    }

    const withdrawbutton = async () => {
        if (withdraw < balance) {
            const newBalance = balance - parseInt(withdraw);
            var data = {
                balance: newBalance,
            };
            let res = await axios.put('http://localhost:8080/auth/editbalance/' + id, data);
            if (res.data.success) {
                setBalance(newBalance);
                setWithdraw(0);
            }
        } else {
            console.log('Amount not sufficient or incorrect amount');
            setWithdraw(0);
        }
    }
    const commands = [
        {
            command: 'reset',
            callback: () => {
                setWithdraw(0)
                setDeposit(0)
                resetTranscript();
                speak("Data has been reset. ");
            },
        },
        {
            command: 'withdraw *',
            callback: (amount) => {
                setWithdraw(amount)
                speak(`Amount to be withdraw is ${amount}`)
            },
        },
        {
            command: 'okay withdraw',
            callback: () => {
                withdrawbutton()
                speak(`Amount withdraw`)
            },
        },
        {
            command: 'deposit *',
            callback: (amount) => {
                setDeposit(amount)
                speak(`Amount to be deposit is ${amount}`)
            },
        },
        {
            command: 'okay deposit',
            callback: () => {
                depositbutton()
                speak(`Amount deposited`)
            },
        },
        {
            command: '* balance',
            callback: () => {
                speak(`Your balance is ${balance}`)
            },
        }
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
    return (
        <>
            {profile.length === 0 ? "Loading" :


                <div className="container">

                    <div className="microphone-btn" >
                        {listening ? <AiOutlineAudio size={30} /> : <BsFillMicMuteFill size={30} />}
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <section className="profile">
                                <h2>{profile[0].name}</h2>
                                <p>Account Number: {profile[0].account}</p>
                                <p>Phone: {profile[0].phone}</p>
                            </section>
                            <div className="row">
                                <div className="col-md-6">
                                    <section className="transaction-container">
                                        <h3>Withdraw</h3>
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="withdraw-amount">Amount:</label>
                                                <input type="number" className="form-control" id="withdraw-amount" min={0} value={withdraw} onChange={(e) => setWithdraw(e.target.value)} />
                                            </div>
                                            <button type="button" onClick={withdrawbutton} className="btn btn-primary">Withdraw</button>
                                        </form>
                                    </section>
                                </div>
                                <div className="col-md-6">
                                    <section className="transaction-container">
                                        <h3>Deposit</h3>
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="deposit-amount">Amount:</label>
                                                <input type="number" className="form-control" id="deposit-amount" min={0} value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                                            </div>
                                            <button type="button" onClick={depositbutton} className="btn btn-primary">Deposit</button>
                                        </form>
                                    </section>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <section className="balance">
                                <h3>Balance</h3>
                                <p id="balance">Rs {balance}</p>
                                <p id="capital">{numberToWords.toWords(balance)} Rupees</p>
                            </section>
                            <div className="center_div">
                                <div className="top_div">
                                    <h2>Credit </h2>
                                    <h1> visa </h1>
                                </div>
                                <img id="card" src="https://i.imgur.com/uDYzSSJ.png" />
                                <div className="bottom_div">
                                    <h2>{profile[0].name}</h2>
                                    <p>{profile[0].card.replace(/-/g, "  -  ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-center">{transcript}</p>
                </div>

            }

        </>
    )
}

export default UserPage