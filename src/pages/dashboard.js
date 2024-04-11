import HomePage from "./home";
import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/dashboard.css';
import './css/navbar.css';


const DashboardPage = () => {
    const [expense, setExpenses] = useState([]);
    const [event, setEvents] = useState([]);
    const [recurring, setRecurring] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
      // Fetch username from local storage
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }, []);
    
    useEffect(() => {
        if(username){
            axios.get("http://localhost:5000/expenses/"+username)
            .then(res => {
                console.log(res)
                setExpenses(res.data[0]);
            })
            .catch(err => console.log(err))            
        }
    }, [username]);

    useEffect(() => {
        if(username){
            axios.get("http://localhost:5000/events/"+username)
            .then(res => {
                console.log(res)
                setEvents(res.data[0]);
            })
            .catch(err => console.log(err))            
        }
    }, [username]);

    useEffect(() => {
        if(username){
            axios.get("http://localhost:5000/recurring/"+username)
            .then(res => {
                console.log(res)
                setRecurring(res.data[0]);
            })
            .catch(err => console.log(err))            
        }
    }, [username]);
     
      return (
        <div>
        <nav className="navbar">
        <a href="/" className="site-title">Coin Calendar</a>
        <ul>
            <li><Link to="/home">Home</Link></li>
            <li className="active"><Link to="/:username/dashboard">Dashboard</Link></li>
            <li><Link to="/:username/settings">Settings</Link></li>
            <li><Link to="/">Log Out</Link></li>
        </ul>
        </nav>
        <h1>Account Dashboard</h1>
        <div class="dashcontainer">
            <div class="quadrant">
                Budget Plan
                <p> WIP not done </p>
            
            
            </div>
            <div class="quadrant">Recent Transactions
                <table className="table">
                    <thead>
                        <tr>
                            <th>expense name</th>
                            <th>expense date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense ? (
                            <tr>
                                <td>{expense.expenseName}</td>
                                <td>{expense.date}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="1">None</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div class="quadrant">Recurring Bills
                <table className="table">
                    <thead>
                        <tr>
                            <th>recur name</th>
                            <th>renew date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recurring ? (
                            <tr>
                                <td>{recurring.billName}</td>
                                <td>{recurring.renewDay}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="1">None</td>
                            </tr>
                        )}
                    </tbody>
                </table>


            </div>
            
            <div class="quadrant">All Upcoming Events
            <table className="table">
                    <thead>
                        <tr>
                            <th>event name</th>
                            <th>event description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {event ? (
                            <tr>
                                <td>{event.eventName}</td>
                                <td>{event.description}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="1">None</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            
            </div>
        </div>
        </div>
      );
    };

export default DashboardPage;