import React, { useEffect, useState } from 'react'
import './UserPage.css'
import axios from 'axios';
import jwt_decode from 'jwt-decode';
const UserPage = () => {
    const [profile, setprofile] = useState([])
    const loadProfile = async () => {
        const token = localStorage.getItem("token")
        const dtoken = jwt_decode(token)
        let res = await axios.post('http://localhost:8080/auth/getuser/' + dtoken.userId)
        setprofile([res.data.value]);
    }
    useEffect(() => {
        loadProfile()
    }, [])
    return (
        <>
            {profile.map((curr) => {
                return <div >
                    <h1 >{curr.name}</h1>
                    <p>{curr.phone}</p>
                    <p>{curr.account}</p>
                    <p>{curr.balance}</p>
                </div>
            })}
        </>
    )
}

export default UserPage