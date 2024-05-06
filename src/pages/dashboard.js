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
    const [accountID, setAccountID] = useState('');
    const [balance, setBalance] = useState(0)


    useEffect(() => {
        // Fetch username from local storage
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    useEffect(() => {
        const storedBalance = localStorage.getItem('balance');
        setBalance(storedBalance);
    }, []);

    useEffect(() => {
        if (username) {
            axios.get("http://localhost:5000/expenses/" + username)
                .then(res => {
                    res.data.forEach(expense => {
                        setExpenses(prevExpenses => [...prevExpenses, expense]);
                    });
                })
                .catch(err => console.log(err))
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            axios.get(`http://localhost:5000/events/${username}`)
                .then(res => {
                    res.data.forEach(event => {
                        setEvents(prevEvents => [...prevEvents, event]);
                    });
                })
                .catch(err => console.log(err));
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            axios.get("http://localhost:5000/recurring/" + username)
                .then(res => {
                    res.data.forEach(recurring => {
                        setRecurring(prevRecurrings => [...prevRecurrings, recurring]);
                    });
                })
                .catch(err => console.log(err))
        }
    }, [username]);
    const [selectedBudget, setSelectedBudget] = useState('Option 1');

/////////GET ACCOUNTID
useEffect(() => {
    if (username) {
        const fetchAccountID = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/accountID?username=${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setAccountID(data.accountID);
                } else {
                    console.error('Error fetching accountID:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching accountID:', error);
            }
        };

        fetchAccountID();
    }
}, [username]);

const handleBudgetChange = async (e) => {
    setSelectedBudget(e.target.value);
};
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.put('http://localhost:5000/updateBudget', {
            accountID,
            selectedBudget
        });
        alert('Budget changed successfully!');
    } catch (error) {
        console.error('Error updating budget plan:', error);
        alert('Error updating budget. Please try again.');
    }
};
   
    return (
        <div>
            <nav className="navbar">
                <a href="/" className="site-title">Coin Calendar<a className="site-title-2">for visualizing your budget!</a></a>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li className="active"><Link to="/:username/dashboard">Dashboard</Link></li>
                    <li><Link to="/:username/settings">Settings</Link></li>
                    <li><Link to="/">Log Out</Link></li>
                </ul>
            </nav>
            <div className="Dashboard">
                <h1>Account Dashboard</h1>
                <div class="dashcontainer">
                    <div class="quadrant">
                        Budget Plan
                        <div className="budgetOptions">
                            <h1 className="budgetHead">Select Budget Plan</h1>
                            <h2 className="budgetLabel">Essentials/Spending/Saving</h2>
                            <form onSubmit={handleSubmit}>
                                <select value={selectedBudget} onChange={handleBudgetChange}>
                                    <option value='Option 1'>None</option>
                                    <option value="Option 2">50% / 30% / 20%</option>
                                    <option value="Option 3">60% / 20% / 20%</option>
                                    <option value="Option 4">40% / 50% / 10%</option>
                                </select>
                                <button type="submit" style={{ display: selectedBudget === 'Option 1' ? 'none' : 'inline-block', marginLeft: '10px' }}>Submit</button>
                            </form>
                            {selectedBudget === 'Option 2' && (
                                <div>
                                    <h1 className="budgetdesc">50 / 30 / 20 Split</h1>
                                    <p className="budgetdesc">The 50/30/20 budgeting plan is a general rule of thumb perfect for those new to budgeting. It allocates
                                        50% of income to essentials like rent, food, bills, etc., 30% to a spending budget for any personal desires
                                        or outings, and 20% to savings for the future or investments.
                                    </p>
                                    <br />
                                    <h2 className="budgetdesc">Current Allocation of ${balance}</h2>
                                    <p className="budgetdesc">Essentials (50%) - ${(balance * 0.5).toFixed(2)}</p>
                                    <p className="budgetdesc">Spending (30%) - ${(balance * 0.3).toFixed(2)}</p>
                                    <p className="budgetdesc">Savings (20%) - ${(balance * 0.2).toFixed(2)}</p>
                                </div>
                            )}
                            {selectedBudget === 'Option 3' && (
                                <div>
                                    <h1 className="budgetdesc">60 / 10 / 30 Split</h1>
                                    <p className="budgetdesc">The 60/10/30 budgeting plan is designed to focus slightly more on essential spending and savings rather than
                                        personal spending. It is useful for those with higher costs of living as well as those who tend to be more frugal
                                        with their non-essential spending, as it only allocates 10% of income to 'wants'.
                                    </p>
                                    <br />
                                    <h2 className="budgetdesc">Current Allocation of ${balance}</h2>
                                    <p className="budgetdesc">Essentials (60%) - ${(balance * 0.6).toFixed(2)}</p>
                                    <p className="budgetdesc">Spending (10%) - ${(balance * 0.1).toFixed(2)}</p>
                                    <p className="budgetdesc">Savings (30%) - ${(balance * 0.3).toFixed(2)}</p>
                                </div>
                            )}
                            {selectedBudget === 'Option 4' && (
                                <div>
                                    <h1 className="budgetdesc">40 / 50 / 10 Split</h1>
                                    <p className="budgetdesc">The 40/50/10 budget plan is geared toward anyone who wishes to dedicate more of their paycheck to their lifestyle.
                                        It draws a few extra funds from both savings and essentials to allocate to personal spending. This is potentially useful
                                        to those with multiple sources of income or an excess of funds in general.
                                    </p>
                                    <br />
                                    <h2 className="budgetdesc">Current Allocation of ${balance}</h2>
                                    <p className="budgetdesc">Essentials (40%) - ${(balance * 0.4).toFixed(2)}</p>
                                    <p className="budgetdesc">Spending (50%) - ${(balance * 0.5).toFixed(2)}</p>
                                    <p className="budgetdesc">Savings (10%) - ${(balance * 0.1).toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div class="quadrant">Recent Transactions

                        <table className="quadrantTable">
                            <thead>
                                <tr>
                                    <th>Expense</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expense.length > 0 ?
                                    (expense.map((expenseItem, index) => {
                                        const expenseDate = new Date(expenseItem.date);
                                        const month = expenseDate.getMonth() + 1;
                                        const day = expenseDate.getDate();
                                        const year = expenseDate.getFullYear();
                                        const formattedExpenseDate = `${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${year}`;
                                        return (

                                            <tr key={index}>
                                                <td>{expenseItem.expenseName}</td>
                                                <td>{expenseItem.category}</td>
                                                <td>{formattedExpenseDate}</td>
                                                <td>{expenseItem.cost}</td>
                                            </tr>
                                        );
                                    })
                                    ) : (
                                        <tr>
                                            <td colSpan="1">None</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>

                    <div class="quadrant">Recurring Bills
                        <table className="quadrantTable">
                            <thead>
                                <tr>
                                    <th>Bill</th>
                                    <th>Freq</th>
                                    <th>Renewal Date</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recurring.length > 0 ? (
                                    recurring.map((recurringItem, index) => (
                                        <tr key={index}>
                                            <td>{recurringItem.billName}</td>
                                            <td>{recurringItem.frequency}</td>
                                            <td>{recurringItem.renewDay}</td>
                                            <td>${recurringItem.cost}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="1">None</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div class="quadrant">All Upcoming Events
                        <table className="quadrantTable">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>desc</th>
                                    <th>Start</th>
                                    <th>End</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.length > 0 ? (
                                    event.map((eventItem, index) => {
                                        const expenseDate_start = new Date(eventItem.datespan_start);
                                        const month_start = expenseDate_start.getMonth() + 1;
                                        const day_start = expenseDate_start.getDate();
                                        const year_start = expenseDate_start.getFullYear();
                                        const formattedEventDate_start = `${month_start < 10 ? '0' : ''}${month_start}/${day_start < 10 ? '0' : ''}${day_start}/${year_start}`;

                                        const expenseDate_end = new Date(eventItem.datespan_end);
                                        const month_end = expenseDate_end.getMonth() + 1;
                                        const day_end = expenseDate_end.getDate();
                                        const year_end = expenseDate_end.getFullYear();
                                        const formattedEventDate_end = `${month_end < 10 ? '0' : ''}${month_end}/${day_end < 10 ? '0' : ''}${day_end}/${year_end}`;
                                    return (
                                        <tr key={index}>
                                            <td>{eventItem.eventName}</td>
                                            <td>{eventItem.description}</td>
                                            <td>{formattedEventDate_start}</td>
                                            <td>{formattedEventDate_end}</td>
                                        </tr>
                                    )
                                })
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
        </div>
    );
};

export default DashboardPage;
