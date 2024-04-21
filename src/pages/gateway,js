import HomePage from "./home";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './css/login.css';

export default function LoginPage() {
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    useEffect(() => {
        // Fetch username from local storage
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
      }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!code) {
            alert('Please fill in all fields');
            return;
        }
        try {
            // Check username and password
            await axios.post('http://localhost:5000/code', {
                username,
                code
            });
            alert('Success!');
            window.location.href = '/resetpassword';
          } catch (error) {
            console.error('Error:', error);
            alert('Incorrect Code. Please try again.');
          }
    };

    return (
        <div className="loginPage">
            <h1 className="pagetitle">Coin Calendar</h1>
            <div className="loginCover">
                <h1>Enter Verification Code</h1>
                <form onSubmit={handleSubmit}>
                <p className="loginText">Code</p>
                    <input className="loginInput" type="text" placeholder="Example: F153FRSqD3" value={code} onChange={(e) => setCode(e.target.value)} />
                    <button type="submit" className="loginBtn">ENTER CODE</button>
                </form>
            </div>
        </div>
    );
}
