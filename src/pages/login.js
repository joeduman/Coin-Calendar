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
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        try {
            // Check username and password
            await axios.post('http://localhost:5000/login', {
                username,
                password
            });
            localStorage.setItem('username', username);
            alert('Login successful'); // Display success message
            console.log("successful login")
            window.location.href = '/home';
          } catch (error) {
            console.error('Error Logging in:', error);
            alert('Error Logging in. Please try again.');
          }
    };

    return (
        <div className="loginPage">
            <h1 className="pagetitle">Coin Calendar</h1>
            <div className="loginCover">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <p className="loginText">Username</p>
                    <input className="loginInput" type="text" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p className="loginText">Password</p>
                    <input className="loginInput" type="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <p><Link to="/forgotpassword">Forgot Password?</Link></p>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="loginBtn">LOGIN</button>
                </form>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
}
