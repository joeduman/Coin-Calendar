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
            alert('Login successful'); // Display success message
            console.log("successful login")
            window.location.href = '/home';
          } catch (error) {
            console.error('Error Logging in:', error);
            alert('Error Logging in. Please try again.');
          }
    };

    return (
        <div className="page">
            <div className="cover">
                <h1>Login</h1>
                <form className="loginTitle" onSubmit={handleSubmit}>
                    <p className="logintitle">Username</p>
                    <input className="logininput" type="text" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p className="logintitle">Password</p>
                    <input className="logininput" type="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <p className="logintext">Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
                <Link to="/home" className="logintext">Go to home page (DEVTOOL)</Link>
            </div>
        </div>
    );
}
