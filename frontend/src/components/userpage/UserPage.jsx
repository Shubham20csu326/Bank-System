import React, { useEffect, useState } from 'react';
import './UserPage.css';
import axios from 'axios';
import { AiOutlineAudio } from 'react-icons/ai';
import { BsFillMicMuteFill } from 'react-icons/bs';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import numberToWords from 'number-to-words';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
const UserPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const [withdraw, setWithdraw] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [balance, setBalance] = useState(0);
    const [id, setId] = useState('');
    const [sender, setSender] = useState("")
    const [reciever, setReciever] = useState("")
    const [amount, setAmount] = useState(0);
    const [transaction, setTransaction] = useState([])

    const loadProfile = async () => {
        const token = localStorage.getItem('token');
        const dtoken = jwt_decode(token);
        let res = await axios.post('http://localhost:8080/auth/getuser/' + dtoken.userId);
        setProfile([res.data.value])
        setBalance(res.data.value.balance)
        setId(res.data.value._id)
        setSender(res.data.value.account)
        setTransaction(res.data.value.transactions)
    };

    useEffect(() => {
        loadProfile();
    }, [transaction]);

    const depositbutton = async () => {

        const dbalance = balance + parseInt(deposit);
        var data = {
            balance: dbalance,
            type: "credit"
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
                type: "debit"
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
                setAmount(0);
                setReciever("");
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
        },
        {
            command: 'logout',
            callback: () => {
                console.log("logout")
                localStorage.clear();
                navigate("/")
            },
        },
        {
            command: 'transfer rupees * to *',
            callback: (amount, account) => {
                account = account.replace(/\s+/g, '');
                if (amount > balance) {
                    speak("Insufficient Balance")
                    setAmount(0);
                    setReciever("");
                }
                else {
                    setAmount(amount);
                    setReciever(account);
                    speak(`Are you sure you want to transfer ${amount} to account ${account}`);
                }

            },
        },
        {
            command: 'okay transfer',
            callback: () => {
                console.log("t")
                tranferbutton()
                speak(`Amount Transferred`)
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
    }, [listening])
    const tranferbutton = async () => {
        var data = {
            "senderAccount": sender,
            "recipientAccount": reciever,
            "amount": amount
        }
        let res = await axios.post('http://localhost:8080/auth/transaction', data)
        if (res.data.success) {
            setSender("")
            setReciever("")
            setAmount(0)
            console.log(res.data.message)
            let d = await axios.post('http://localhost:8080/auth/getuser/' + id);
            setBalance(d.data.value.balance)
        }
        else {
            setSender("")
            setReciever("")
            setAmount(0)
            console.log(res.data.message)
        }
    }
    return (
        <>
            {profile.length === 0 ? "Loading" :


                <div className="container">
                    <div className="transcript">
                        <p className="text-center">{transcript}</p>
                    </div>
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
                            <section className="profile">
                                <h2>Transfer</h2>
                                <div className="input-area">
                                    <input type="text" className="form-control" id="user" placeholder="Account Number" value={reciever} onChange={(e) => setReciever(e.target.value)} />
                                    <input type="number" className="form-control" id="user" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                                <button type="button" className="btn btn-primary" onClick={tranferbutton}>Transfer</button>
                            </section>
                            <div className="row">
                                <div className="col-md-6">
                                    <section className="transaction-container">
                                        <h3>Withdraw</h3>
                                        <form id="user">
                                            <div className="form-group">
                                                <label htmlFor="withdraw-amount">Amount:</label>
                                                <input type="number" className="form-control" id="amount" min={0} value={withdraw} onChange={(e) => setWithdraw(e.target.value)} />
                                            </div>
                                            <button type="button" onClick={withdrawbutton} className="btn btn-primary">Withdraw</button>
                                        </form>
                                    </section>
                                </div>
                                <div className="col-md-6">
                                    <section className="transaction-container">
                                        <h3>Deposit</h3>
                                        <form id="user">
                                            <div className="form-group">
                                                <label htmlFor="deposit-amount">Amount:</label>
                                                <input type="number" className="form-control" id="amount" min={0} value={deposit} onChange={(e) => setDeposit(e.target.value)} />
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
                    <section class="table-responsive" id="table">
                        <table className="table align-middle mb-0 bg-white">
                            <thead className="bg-light">
                                <tr id="heading">
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                    <th>Type</th>
                                    <th>Account Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.reverse().map((curr) => {
                                    return <tr>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="ms-3">
                                                    <p className="fw-bold mb-1">{curr.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="fw-normal mb-1">{curr.amount}</p>
                                        </td>
                                        <td>
                                            <p className="fw-normal mb-1">{curr.updatedBalance}</p>
                                        </td>
                                        {curr.type == "credit" ?
                                            <td><span className="badge badge-primary rounded-pill d-inline">{curr.type}</span></td> :
                                            <td><span className="badge badge-success rounded-pill d-inline">{curr.type}</span></td>}
                                        <td>
                                            {curr.account ? curr.account : "----"}
                                        </td>
                                    </tr>
                                })}

                            </tbody>
                        </table>
                    </section>

                </div>

            }

        </>
    )
}

export default UserPage