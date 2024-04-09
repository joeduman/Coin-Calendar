import HomePage from "./home";
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './css/settings.css';
import './css/navbar.css';

export default function SettingsPage() {
    return (
        <div>
            <nav className="navbar">
                <a href="/" className="site-title">Coin Calendar</a>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li className="active"><a href="/settings">Settings</a></li>
                    <li><a href="/">Log Out</a></li>
                </ul>
            </nav>
            <h1>Account Settings</h1>
            <div>
                <form className="settingscontainer">
                    <div className="form-group">
                        <input type="text" placeholder="first name" required></input>
                        <input type="text" placeholder="last name" required></input>
                        <input type="text" placeholder="email" required></input>
                        <input type="text" placeholder="phone number" required></input>
                        <input type="text" placeholder="password" required></input>
                        <input type="text" placeholder="confirm new password" required></input>
                        <button className="save">save</button>
                        <a>Cancel</a>
                        <a></a>
                        <button className="delAccount">Delete Account</button> 
                    </div>
                </form>
            </div>


        </div>

    );
}
