import HomePage from "./home";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './css/login.css';

export default function LoginPage() {
    const [newPassword, setPassword] = useState('');
    const [confrim_password, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    useEffect(() => {
        // Fetch username from local storage
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
      }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!newPassword || !confrim_password) {
            alert('Please fill in all fields');
            return;
        }
        if (newPassword != confrim_password) {
            alert('Passwords do not match');
            return;
        }
        try {
            await axios.post('http://localhost:5000/changepass', {
                username,
                newPassword
            });
            alert('Password reset successful!'); // Display success message
            window.location.href = '/';
          } catch (error) {
            console.error('Error:', error);
            alert('Error resetting password. Please try again.');
          }
    };

    return (
        <div className="loginPage">
            <h1 className="pagetitle">Coin Calendar</h1>
            <div className="loginCover">
                <h1>Create new password</h1>
                <form onSubmit={handleSubmit}>
                <p className="loginText">New Password</p>
                    <input className="loginInput" type="password" placeholder="Type new password" value={newPassword} onChange={(e) => setPassword(e.target.value)} />
                    <p className="loginText">Confirm New Password</p>
                    <input className="loginInput" type="password" placeholder="Confirm new password" value={confrim_password} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="submit" className="loginBtn">RESET PASSWORD</button>
                </form>
            </div>
        </div>
    );
}
