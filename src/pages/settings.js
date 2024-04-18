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
                <a href="/" className="site-title">Coin Calendar <a className="site-title-2">for visualizing your budget!</a></a>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/:username/dashboard">Dashboard</Link></li>
                    <li className="active"><Link to="/:username/settings">Settings</Link></li>
                    <li><Link to="/">Log Out</Link></li>
                </ul>
            </nav>
            <div className="Settings">
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


        </div>

    );
}
