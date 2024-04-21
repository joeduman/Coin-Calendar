import HomePage from "./home";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './css/login.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!username || !email) {
            alert('Please fill in all fields');
            return;
        }
        try {
            // Check username and email within database
            await axios.post('http://localhost:5000/resetpassword', {
                username,
                email
            });
            alert('An email has been sent.'); // Display success message
            localStorage.setItem('username', username);
            window.location.href = '/gateway';
          } catch (error) {
            console.error('Error:', error);
            alert('Username or Email does not match. Please try again.');
          }
        
    };

    return (
        <div className="loginPage">
            <h1 className="pagetitle">Coin Calendar</h1>
            <div className="loginCover">
                <h1>Forgot Password?</h1>
                <form onSubmit={handleSubmit}>
                    <p className="loginText">Username</p>
                    <input className="loginInput" type="text" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p className="loginText">Email</p>
                    <input className="loginInput" type="text" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit" className="loginBtn">SEND EMAIL</button>
                </form>
            </div>
        </div>
    );
}
