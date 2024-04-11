import HomePage from "./home";
import React, { useState, useEffect } from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './css/dashboard.css';
import './css/navbar.css';

export default function DashboardPage() {
    return (
        <div>
        <nav className="navbar">
        <a href="/" className="site-title">Coin Calendar</a>
        <ul>
            <li><a href="/home">Home</a></li>
            <li className="active"><a href="/dashboard">Dashboard</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/">Log Out</a></li>
        </ul>
      </nav>

        <h1>Account Dashboard</h1>
        <div class="dashcontainer">
            <div class="quadrant">Budget Plan</div>
            <div class="quadrant">Recent Transactions</div>
            <div class="quadrant">Recurring Bills</div>
            <div class="quadrant">All Upcoming Events</div>
        </div>
              



        </div>
    );
}
