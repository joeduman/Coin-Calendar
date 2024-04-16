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
    const[selectedBudget, setSelectedBudget] = useState('Option 1');
    const handleBudgetChange = (e) => {
        setSelectedBudget(e.target.value);
    };
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
                <div>
                    <h1 className="budgetHead">Select Budget Plan</h1>
                    <h2 className="budgetLabel">Essentials/Spending/Saving</h2>
                    <select value={selectedBudget} onChange={handleBudgetChange}>
                        <option value='Option 1'>None</option>
                        <option value="Option 2">50% / 30% / 20%</option>
                        <option value="Option 3">60% / 20% / 20%</option>
                        <option value="Option 4">40% / 50% / 10%</option>
                    </select>
                    {selectedBudget === 'Option 2' && <div>
                    <h1 className="budgetdesc">50 / 30 / 20 Split</h1>
                    <p className="budgetdesc">The 50/30/20 budgeting plan is a general rule of thumb perfect for those new to budgeting. It allocates
                        50% of income to essentials like rent, food, bills, etc., 30% to a spending budget for any personal desires
                        or outings, and 20% to savings for the future or investments.</p>
                    </div>}
                    {selectedBudget === 'Option 3' && <div>
                    <h1 className="budgetdesc">60 / 10 / 30 Split</h1>
                    <p className="budgetdesc">The 60/10/30 budgeting plan is designed to focus slightly more on essential spending and savings rather than
                        personal spending. It is useful for those with higher costs of living as well as those who tend to be more frugal
                        with their non-essential spending, as it only allocates 10% of income to 'wants'. 
                    </p>
                    </div>}
                    {selectedBudget === 'Option 4' && <div>
                    <h1 className="budgetdesc">40 / 50 / 10 Split</h1>
                    <p className="budgetdesc">The 40/50/10 budget plan is geared toward anyone who wishes to dedicate more of their paycheck to their lifestyle.
                        It draws a few extra funds from both savings and essentials to allocate to personal spending. This is potentially useful
                    to those with multiple sources of income or an excess of funds in general. 
                    </p>
                </div>}
                </div>
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
