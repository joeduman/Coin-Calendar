import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./css/home.css";

import axios from 'axios';

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

import EventList from "../EventList";

const locales = {
  "en-US": require("date-fns/locale/en-US")
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const events = [];
const expenses = [];
const recurringBills = [];

export default function HomePage() {

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    allDay: false, // Added allDay property
    eventID: null
  });

  //EXPENSE
  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "",
    date: "",
    cost: "",
    expenseID: null
  });

  const [allBills, setAllBills] = useState(recurringBills);

  function handleNewBill() {
    if (!newBill.name || !newBill.amount || !newBill.day) {
      alert("Please fill out all fields");
      return;
    }
    newBill.amount = '$' + newBill.amount
    setAllBills([...allBills, newBill]);
    setNewBill({
      name: "",
      amount: "",
      day: ""
    });
  }

  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    day: ""
  });
  const [allExpenses, setAllExpenses] = useState(expenses);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState(events);
  const [balance, setBalance] = useState(0);
  const [expectedBalance, setExpectedBalance] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [accountID, setAccountID] = useState('');

  useEffect(() => {
    // Fetch username from local storage
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  /////////GET ACCOUNTID FOR CREATING EVENTS AND EXPENSES
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

  useEffect(() => {
    setExpectedBalance(balance);
  }, [balance]);

  useEffect(() => {
    const totalCost = allExpenses.reduce((total, expense) => {
      return total + parseFloat(expense.cost);
    }, 0);
    setExpectedBalance(balance - totalCost);
  }, [balance, allExpenses]);


  async function handleAddEvent() {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.description) {
      alert("Please fill out all the fields.");
      return;
    }

    // Send the event data including converted time to the server
    try {
      const response = await axios.post('http://localhost:5000/api/events', {
        accountID: accountID,
        eventName: newEvent.title,
        description: newEvent.description,
        repeat: false,
        datespan_start: `${new Date(newEvent.start).toISOString().replace('T', ' ').replace('.000Z', '')}`,
        datespan_end: `${new Date(newEvent.end).toISOString().replace('T', ' ').replace('.000Z', '')}`,
      });

      // Add the event to the list of events and update the state
      newEvent.eventID = response.data.expense.eventID;
      setAllEvents([...allEvents, newEvent]);

      console.log("Event added to the database.");

      // Reset the newEvent state
      setNewEvent({
        title: "",
        start: "",
        end: "",
        description: "",
        allDay: false,
        eventID: null // Reset the event ID
      });

    } catch (error) {
      console.error("Failed to add event to the database:", error);
    }
  }


  function eventStyleGetter(event) {
    // Customize style based on event type
    if (event.isExpense) {
      return {
        style: {
          backgroundColor: 'orange', // Color for expenses
        },
      };
    }
    return {}; // Default style for regular events
  }


  async function handleAddExpense() {
    if (!newExpense.name || !newExpense.category || !newExpense.date || !newExpense.cost) {
      alert("Please fill out all the fields.");
      return;
    }

    // Create a new event for the expense
    const expenseEvent = {
      title: newExpense.name,
      start: newExpense.date,
      end: newExpense.date,
      description: newExpense.category,
      spendingQuota: `$${newExpense.cost}`,
      allDay: true, // Assuming the expense occurs on a single day
      isExpense: true, // Mark as an expense
    };

    // Add the expense event to the list of calendar events

    try {
      // Send an HTTP POST request to the backend API using Axios to add the expense
      const response = await axios.post('http://localhost:5000/api/expenses', {
        accountID,
        expenseName: newExpense.name,
        category: newExpense.category,
        date: new Date(newExpense.date).toISOString().slice(0, 10),
        cost: parseFloat(newExpense.cost),
      });

      // Update the state with the newly added expense
      expenseEvent.expenseID = response.data.expense.expenseID;
      newExpense.expenseID = response.data.expense.expenseID;
      setAllExpenses([...allExpenses, newExpense]);
      setAllEvents([...allEvents, expenseEvent]);

      console.log("Expense added to the database.");

      // Reset the newExpense state
      setNewExpense({
        name: "",
        category: "",
        date: "",
        cost: "",
        expenseID: null
      });

    } catch (error) {
      console.error("Failed to add expense to the database:", error);
      alert("Error adding expense to the database. Please try again.");
    }
  }

  function handleUpdateBalance() {
    setBalance(updatedBalance);
  }

  function handleEventClick(event) {
    setSelectedEvent(event);
  }

  function handleCloseEventDetails() {
    setSelectedEvent(null);
  }

  async function handleRemoveEvent() {
    try {
      // Check if the selected event is an expense
      if (selectedEvent.isExpense) {
        // Find the corresponding expense in the allExpenses array
        console.log(selectedEvent.expenseID)
        const expenseToRemove = allExpenses.find(expense => expense.expenseID === selectedEvent.expenseID);

        if (expenseToRemove) {

          // Make an HTTP DELETE request to remove the expense from the database
          await axios.delete("http://localhost:5000/remove/expenses/" + expenseToRemove.expenseID);

          console.log('Expense deleted from the database successfully');


          // Remove the expense from the allExpenses array
          const updatedExpenses = allExpenses.filter(expense => expense.expenseID !== expenseToRemove.expenseID);
          setAllExpenses(updatedExpenses);

          // Update the expected balance by subtracting the cost of the removed expense
          const updatedExpectedBalance = expectedBalance + parseFloat(expenseToRemove.cost);
          setExpectedBalance(updatedExpectedBalance);
          // Close the event details panel
          setSelectedEvent(null);

          // Remove the selected event from the allEvents array
          const updatedEvents = allEvents.filter(event => {
            // Check if the event is the one selected for removal
            if (event === selectedEvent) {
              return false; // Remove this event
            }
            return true; // Keep other events
          });
          setAllEvents(updatedEvents);
        }
      } else {

        // Make an HTTP DELETE request to remove the event from the database
        await axios.delete("http://localhost:5000/remove/events/" + selectedEvent.eventID);

        console.log('Event deleted from the database successfully');

        // Remove the selected event from the allEvents array
        const updatedEvents = allEvents.filter(event => event.eventID !== selectedEvent.eventID);
        setAllEvents(updatedEvents);

        // Close the event details panel
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error removing event:', error);
      // Handle the error as needed
    }
  }


  /////////POPULATE USER EVENTS
  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:5000/events/${username}`)
        .then(res => {
          if (res.data && res.data.length > 0) {
            // Map over each event from the server response
            const formattedEvents = res.data.map((eventData) => ({
              title: eventData.eventName,
              start: new Date(eventData.datespan_start),
              end: new Date(eventData.datespan_end),
              description: eventData.description,
              allDay: false, // Assuming the event is not all day; adjust if necessary
              eventID: eventData.eventID,
            }));

            // Update the state by adding all formatted events to the allEvents array
            setAllEvents((prevEvents) => [...prevEvents, ...formattedEvents]);
          }
        })
        .catch(err => console.error('Error fetching events:', err));
    }
  }, [username]);
  /////////POPULATE USER EXPENSES
  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:5000/expenses/${username}`)
        .then(res => {
          if (res.data && res.data.length > 0) {
            // Map over each expense from the server response
            const formattedExpenses = res.data.map((expenseData) => ({
              name: expenseData.expenseName,
              date: new Date(expenseData.date),
              category: expenseData.category,
              cost: expenseData.cost,
              expenseID: expenseData.expenseID,
            }));

            // Update the state by adding all formatted expenses to the allExpenses array
            setAllExpenses((prevExpenses) => [...prevExpenses, ...formattedExpenses]);

            // Iterate over each formatted expense to convert it into an event
            const formattedEvents = formattedExpenses.map((expense) => ({
              title: expense.name,
              start: expense.date,
              end: expense.date,
              description: expense.category,
              spendingQuota: `$${expense.cost}`,
              expenseID: expense.expenseID,
              allDay: true, // Assuming the expense occurs on a single day
              isExpense: true, // Mark as an expense
            }));

            // Add the formatted events to the allEvents array
            setAllEvents((prevEvents) => [...prevEvents, ...formattedEvents]);
          }
        })
        .catch(err => console.error('Error fetching expenses:', err));
    }
  }, [username]);




  return (
    <div>
      <nav className="navbar">
        <a href="/" className="site-title">Coin Calendar<a className="site-title-2">for visualizing your budget!</a></a>
        <ul>
          <div className="legend">
            <span className="legend-item orange-square"></span> Orange: Expenses
            <span className="legend-item blue-square"></span> Blue: Events
          </div>
          <li className="active"><a href="/home">Home</a></li>
          <li><a href="/:username/dashboard">Dashboard</a></li>
          <li><a href="/:username/settings">Settings</a></li>
          <li><a href="/">Log Out</a></li>
        </ul>
      </nav>

      <div className="Home">
        <h1><u>{username}'s Coin Calendar</u>
        
        <HiOutlineQuestionMarkCircle  
          className="hover-tooltip" 
          title="Orange : Expenses
           Blue : Events"/>
        </h1> 
          
        <div className="container">
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 750 }}
              onSelectEvent={handleEventClick}
              eventPropGetter={eventStyleGetter}
            />
          </div>
          
          <div className="divBar"/>

          <div className="rightside">
            <div className="widget">
              <h2>Monthly Budget</h2>
              <p>Great job! You are still at $300 left</p>
              <progress className="progress-bar" max="100" value={20} />
              <table className="budget">
                  <tr>
                    <th>Money Spent</th>
                    <th>Budget Remaining</th>
                  </tr>
                  <tr>
                    <td className="spent">$500</td>
                    <td className="remain">$3500</td>
                  </tr>
              </table>
            </div>

            {selectedEvent && (
              <div className="event-details">
                <h2>Details</h2>
                <p>Title: {selectedEvent.title}</p>
                <p>Start Date: {selectedEvent.start.toLocaleString()}</p>
                <p>End Date: {selectedEvent.end.toLocaleString()}</p>
                <p>Description: {selectedEvent.description}</p>
                <p>Cost: {selectedEvent.spendingQuota}</p>
                <button onClick={handleCloseEventDetails}>Close</button>
                <button onClick={handleRemoveEvent}>Remove</button>
              </div>
            )}
          </div>
        </div>

        <div /*ADD EVENT */ className="eventContainer">
          <div className="add-event-container">
            <div className="add-event">
              <h2>Add Event</h2>
              <input
                type="text"
                placeholder="Add Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <div className="date-pickers">
                <DatePicker
                  placeholderText="Start Date"
                  selected={newEvent.start}
                  onChange={(start) => setNewEvent({ ...newEvent, start })}
                />
                <DatePicker
                  placeholderText="End Date"
                  selected={newEvent.end}
                  onChange={(end) => setNewEvent({ ...newEvent, end })}
                />
                {!newEvent.allDay && ( // Render time picker if not all-day event
                  <>
                    <DatePicker
                      placeholderText="Start Time"
                      selected={newEvent.start}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      dateFormat="hh:mm:ss"
                      onChange={(start) => setNewEvent({ ...newEvent, start })}
                    />
                    <DatePicker
                      placeholderText="End Time"
                      selected={newEvent.end}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      dateFormat="hh:mm:ss"
                      onChange={(end) => setNewEvent({ ...newEvent, end })}
                    />
                  </>
                )}
              </div>
              <input
                type="text"
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
              <label>
                <input
                  type="checkbox"
                  checked={newEvent.allDay}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, allDay: e.target.checked })
                  }
                />
                All Day Event
              </label>
              <button onClick={handleAddEvent}>Add Event</button>
            </div>
          </div>
 
          <div /*ADD EXPENSE */ className="add-event-container">
              <div className="add-event">
                <h2>Add Expense</h2>
                <input
                  type="text"
                  placeholder="Expense Name"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                />
                <DatePicker
                  placeholderText="Date"
                  selected={newExpense.date}
                  onChange={(date) => setNewExpense({ ...newExpense, date })}
                />
                <input
                  type="number"
                  placeholder="Cost"
                  value={newExpense.cost}
                  onChange={(e) => setNewExpense({ ...newExpense, cost: e.target.value })}
                />
                <button onClick={handleAddExpense}>Add Expense</button>
              </div>
            </div>

            <div /*ADD DEPOSIT */ className="add-event-container">
              <div className="add-event">
                <h2>Add Deposit</h2>
                <input
                  type="text"
                  placeholder="Amount"
                />
                <button onClick={handleNewBill}>Add Deposit</button>
              </div>
            </div>

            <div /*ADD RECUR */ className="add-event-container">
              <div className="add-event">
                <h2>Add Recurring Bill</h2>
                <input
                  type="text"
                  placeholder="Bill Name"
                  value={newBill.name}
                  onChange={(e) =>
                    setNewBill({ ...newBill, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={newBill.amount}
                  onChange={(e) =>
                    setNewBill({ ...newBill, amount: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Day"
                  value={newBill.day}
                  onChange={(e) =>
                    setNewBill({ ...newBill, day: e.target.value })
                  }
                />
                <button onClick={handleNewBill}>Add Bill</button>
              </div>
            </div>

            <div className="container">
              <div className="balance-section">
                <h2>Balance: ${balance}</h2>
                <input
                  type="number"
                  placeholder="Enter Balance"
                  value={updatedBalance}
                  onChange={(e) => setUpdatedBalance(parseInt(e.target.value))}
                />
                <button onClick={handleUpdateBalance}>Update Balance</button>
                <h2>Expected Balance: ${expectedBalance}</h2>
                <EventList events={allEvents} />
              </div>
            </div>

        </div>
      </div>
    </div>
  );
}
