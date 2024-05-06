import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./css/home.css";
import "./css/modal.css";

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
  const [modal1Open, set1Open] = useState(false);
  const [modal2Open, set2Open] = useState(false);
  const [modal3Open, set3Open] = useState(false);
  const [modal4Open, set4Open] = useState(false);
  const [currentMonth,setCurrentMonth] = useState('');
  const [currentMonthDigit,setCurrentMonthDigit] = useState(0);
  const [currentYear,setCurrentYear] = useState(0);
  const [spending,setSpending] = useState(0);
  const [essential,setEssential] = useState(0);

  function openModal1() {
    set1Open(true);
  }
  function closeModal1() {
    set1Open(false);
  }
  function openModal2() {
    set2Open(true);
  }
  function closeModal2() {
    set2Open(false);
  }
  function openModal3() {
    set3Open(true);
  }
  function closeModal3() {
    set3Open(false);
  }
  function openModal4() {
    set4Open(true);
  }
  function closeModal4() {
    set4Open(false);
  }

  const getCurrentMonthAndYear = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[date.getMonth()];
    const currentMonthDigit = date.getMonth();
    const currentYear = date.getFullYear();
    return { currentMonth, currentMonthDigit, currentYear };
  };

  useEffect(() => {
    // Set the current month and year when the component mounts
    const currentDate = new Date();
    const { currentMonth, currentMonthDigit, currentYear } = getCurrentMonthAndYear(currentDate);
    setCurrentMonth(currentMonth);
    setCurrentMonthDigit(currentMonthDigit);
    setCurrentYear(currentYear);
  }, []);

  const handleNavigate = (newDate) => {
    const { currentMonth, currentYear } = getCurrentMonthAndYear(newDate);
    setCurrentMonth(currentMonth);
    setCurrentMonthDigit(currentMonthDigit);
    setCurrentYear(currentYear);
    if (username && currentMonthDigit && currentYear) {
      axios.get(`http://localhost:5000/monthlySpent/${username}/${currentMonthDigit}/${currentYear}`)
        .then(res => {
          if (res.data) {
            // Update the state by adding all formatted expenses to the allExpenses array
            console.log(res.data);
            setEssential(res.data.spentessential);
          }
        })
        .catch(err => console.error('Error fetching expenses:', err));
    }
  };
  

  //EVENT
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
    category: "Essential",
    date: "",
    cost: "",
    expenseID: null
  });

  //RECURRING-BILL
  const [newRecur, setNewRecurring] = useState({
    name: "",
    category: "Essential",
    date: "",
    cost: "",
    frequency: "",
    recurID: null
  });

  const [allExpenses, setAllExpenses] = useState(expenses);
  const [allRecurring, setAllRecurring] = useState(recurringBills)
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState(events);
  const [balance, setBalance] = useState(0);
  const [expectedBalance, setExpectedBalance] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [accountID, setAccountID] = useState('');

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
    //Fetch username from local storage
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    
  }, []);

  /*useEffect(() => {
    setBalance(balance);
  }, [balance]);*/

  useEffect(() => {
    const totalCost = allExpenses.reduce((total, expense) => {
      return total + parseFloat(expense.cost);
    }, 0);
    setExpectedBalance(balance - totalCost);
  }, [balance, allExpenses]);

  function formatDateSQL(date) {
    // Extract the year, month, day, hours, minutes, and seconds from the date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1 and pad to 2 digits
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Combine the date and time components into the desired format
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  const handleDateMax = (e) => {
    let inputValue = parseInt(e.target.value);
    
    //If the input value is greater than 31, set it to 31
    if (inputValue > 31) {
      inputValue = 31;
    }
    if (inputValue < 1) {
      inputValue = 1;
    }

    setNewRecurring({ ...newRecur, date: inputValue });
  };

  const handleMinAmount = (e) => {
    let inputValue = parseFloat(e.target.value);
    
    //If the input value is greater than 31, set it to 31
    if (inputValue < 0) {
      inputValue = 0;
    }

    setNewRecurring({ ...newRecur, cost: inputValue });
  };


  async function handleAddEvent() {
    if ((String(newEvent.name).length || String(newEvent.description).length) > 12) {
      alert("Event details must be less than 12 characters!");
      return;
    }
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
        datespan_start: `${formatDateSQL(new Date(String(newEvent.start)))}`,
        datespan_end: `${formatDateSQL(new Date(String(newEvent.end)))}`,
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
          backgroundColor: '#FF6363', // Color for expenses
        },
      };
    }
    else if (event.isRecur) {
      return {
        style: {
          backgroundColor: '#FFDD63',
        },
      };
    }
    else if (event.isDeposit) {
      return {
        style: {
          backgroundColor: '#63FF72',
        },
      };
    }
    else {
      return {
        style: {
          backgroundColor: '#D663FF',
        },
      };
    }
  }

  async function handleAddExpense() {
    if ((String(newExpense.name).length || String(newExpense.category).length) > 12) {
      alert("Expense details must be less than 12 characters!");
      return;
    }
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
      isRecur: false,
      isEvent: false,
      isDeposit: false,
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
        category: "Essential",
        date: "",
        cost: "",
        expenseID: null
      });

    } catch (error) {
      console.error("Failed to add expense to the database:", error);
      alert("Error adding expense to the database. Please try again.");
    }
  }

  async function handleAddRecurring() {
    if ((String(newRecur.name).length || String(newRecur.category).length) > 12) {
      alert("bill details must be less than 12 characters!");
      return;
    }
    if (!newRecur.name || !newRecur.category || !newRecur.date || !newRecur.cost || !newRecur.frequency) {
      alert("Please fill out all the fields.");
      return;
    }

    // Create a new Date object for the current month
    const currentDate = new Date();
    const maxDayOfMonth = new Date(currentDate.getFullYear(), 4, 0).getDate();

    // If the input value is greater than the maximum day of the current month,
    // set the input value to the maximum day of the current month
    if (newRecur.date > maxDayOfMonth) {
      newRecur.date = maxDayOfMonth;
      setNewRecurring({ ...newRecur, date: newRecur.date });
    } else {
      setNewRecurring({ ...newRecur, date: newRecur.date });
    }
  
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), newRecur.date);

    // Create a new event for the recur in calendar
    const recurEvent = {
      title: newRecur.name,
      start: currentMonthStart,
      end: currentMonthStart,
      category: newRecur.category,
      frequency: newRecur.frequency,
      spendingQuota: `$${newRecur.cost}`,
      allDay: true, // Assuming the expense occurs on a single day
      isExpense: false, // Mark as an expense
      isRecur: true,
      isEvent: false,
      isDeposit: false,
    };

    // Add the expense event to the list of calendar events
    try {
      // Send an HTTP POST request to the backend API using Axios to add the expense
      const response = await axios.post('http://localhost:5000/api/recurring', {
        accountID: accountID,
        billName: newRecur.name,
        renewDay: newRecur.date,
        frequency: newRecur.frequency,
        category: newRecur.category,
        cost: newRecur.cost
      });


      // Update the state with the newly added bill
      recurEvent.recurID = response.data.recur.recurID;
      newRecur.recurID = response.data.recur.recurID;
      setAllRecurring([...allRecurring, newRecur]);
      setAllEvents([...allEvents, recurEvent]);

      console.log("Recurring bill added to the database.");

      // Reset the newrecurring state
      setNewRecurring({
        name: "",
        category: "",
        date: "",
        cost: "",
        frequency: "",
        recurID: null
      });

    } catch (error) {
      console.error("Failed to add recurring-bill to the database:", error);
      alert("Error adding recurring-bill to the database. Please try again.");
    }
  }

  function handleUpdateBalance() {
    setBalance(balance + updatedBalance);
    const updateTotalBalance = async () => {
      try {
        await axios.put(`http://localhost:5000/balance`, {
          accountID,
          totalBalance: balance + updatedBalance
        });
        console.log("Total balance updated successfully.");
      } catch (error) {
        console.error("Error updating total balance:", error);
      }
    };

    updateTotalBalance();
    localStorage.setItem('balance', updatedBalance);
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
      } else if (selectedEvent.isRecur){
        const recurToRemove = allRecurring.find(recur => recur.recurID === selectedEvent.recurID);
        if (recurToRemove) {
          // Make an HTTP DELETE request to remove the expense from the database
          await axios.delete("http://localhost:5000/remove/recurring/" + selectedEvent.recurID);
          console.log('Expense deleted from the database successfully');
          // Remove the expense from the allExpenses array
          const updatedRecurring = allExpenses.filter(recur => recur.recurID !== recurToRemove.recurID);
          setAllRecurring(updatedRecurring);
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
              isRecur: false,
              isEvent: false,
              isDeposit: false,
            }));

            // Add the formatted events to the allEvents array
            setAllEvents((prevEvents) => [...prevEvents, ...formattedEvents]);
          }
        })
        .catch(err => console.error('Error fetching expenses:', err));
    }
  }, [username]);

  /////////POPULATE USER RECURRING-BILLS
  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:5000/recurring/${username}`)
        .then(res => {
          // Create a new Date object for the current month
          const currentDate = new Date();
          if (res.data && res.data.length > 0) {
            // Map over each expense from the server response
            const formattedRecurring = res.data.map((recurData) => ({
              name: recurData.billName,
              date: new Date(currentDate.getFullYear(), currentDate.getMonth(), recurData.renewDay),
              category: recurData.category,
              frequency: recurData.frequency,
              cost: recurData.cost,
              recurID: recurData.recurID,
            }));

            // Update the state by adding all formatted expenses to the allExpenses array
            setAllRecurring((prevRecurring) => [...prevRecurring, ...formattedRecurring]);

            // Iterate over each formatted expense to convert it into an event
            const formattedEvents = formattedRecurring.map((recur) => ({
              title: recur.name,
              start: recur.date,
              end: recur.date,
              description: recur.category,
              spendingQuota: `$${recur.cost}`,
              recurID: recur.recurID,
              allDay: true, // Assuming the expense occurs on a single day
              isExpense: false, // Mark as an expense
              isRecur: true,
              isEvent: false,
              isDeposit: false,
            }));

            // Add the formatted events to the allEvents array
            setAllEvents((prevEvents) => [...prevEvents, ...formattedEvents]);
          }
        })
        .catch(err => console.error('Error fetching expenses:', err));
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:5000/get_balance/${username}`)
        .then(res => {
          if (res.data) {
            // Update the state by adding all formatted expenses to the allExpenses array
            setBalance(res.data.balance);

          }
        })
        .catch(err => console.error('Error fetching expenses:', err));
    }
  }, [username]);

  useEffect(() => {
    if (username && currentMonthDigit && currentYear) {
      axios.get(`http://localhost:5000/monthlySpent/${username}/${currentMonthDigit}/${currentYear}`)
        .then(res => {
          if (res.data) {
            // Update the state by adding all formatted expenses to the allExpenses array
            console.log(res.data);
            setEssential(res.data.spentessential);
          }
        })
        .catch(err => console.error('Error fetching expenses:', err));
    }
  }, [username, currentMonthDigit, currentYear]);




  return (
    <div>
      <nav className="navbar">
        <a href="/" className="site-title">Coin Calendar<span className="site-title-2">for visualizing your budget!</span></a>
        <ul>
          <li className="active"><Link to="/home">Home</Link></li>
          <li><Link to="/:username/dashboard">Dashboard</Link></li>
          <li><Link to="/:username/settings">Settings</Link></li>
          <li><Link to="/">Log Out</Link></li>
        </ul>
      </nav>

      <div className="Home">
        <h1><u>{username}'s Coin Calendar</u>
          <HiOutlineQuestionMarkCircle
            className="hover-tooltip"/>
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
              onNavigate={handleNavigate}
            />
          </div>

          <div className="divBar" />

          <div className="rightside">

            <div className="widget" id="totalsavings">
                <h2>Total Savings</h2>
                <p>${balance.toFixed(2)}</p>
              </div>

            <div className="widget">
              <h2>Monthly Budget</h2>
              <p>You have ${expectedBalance.toFixed(2)} left</p>
              <progress className="progress-bar" max={balance.toFixed(2)} value={(balance - expectedBalance).toFixed(2)} />
              <table className="budget">
                <thead>
                  <tr>
                    <th>Money Spent</th>
                    <th>Budget Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="spent">${(balance - expectedBalance).toFixed(2)}</td>
                    <td className="remain">${expectedBalance.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="widget" id="balances">
              <h2>{currentMonth} {currentYear}</h2>
              <table className="budget">
                <thead>
                  <tr>
                    <th>spending:</th>
                    <th>essential:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="spent">${spending.toFixed(2)}</td>
                    <td className="spent">${essential.toFixed(2)}</td>
                  </tr>
                </tbody>
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


        <div className="eventContainer">
        <button
        className="openAddEventBtn"
        onClick={() => {openModal1(true);}}/>
        <Modal
          className="modalContainer"
          isOpen={modal1Open}
          onRequestClose={closeModal1}
          ariaHideApp={false}
        >
          <div className="titleCloseBtn">
            <button onClick={() => {closeModal1();}}> X </button>
          </div>

          <div className="eventForm">
          <h2>Add Event</h2>
          <div className="add-event-container">
            <div className="add-event">
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
                      timeIntervals={15}
                      dateFormat="h:mm a"
                      onChange={(start) => setNewEvent({ ...newEvent, start })}
                    />
                    <DatePicker
                      placeholderText="End Time"
                      selected={newEvent.end}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      dateFormat="h:mm a"
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
              <button className="addButton" onClick={() => { handleAddEvent(); closeModal1(); }}>Add Event</button>
            </div>
          </div>
        </div> 
        </Modal>

        <button
        className="openAddEventBtn"
        onClick={() => {openModal2(true);}}
        id='2'/>
        <Modal
          className="modalContainer"
          isOpen={modal2Open}
          onRequestClose={closeModal2}
          ariaHideApp={false}
        >
          <div className="titleCloseBtn">
            <button onClick={() => {closeModal2();}}> X </button>
          </div>

          <div className="eventForm">
            <h2>Add Expense</h2>
            <div /*ADD EXPENSE */ className="add-event-container">
              <div className="add-event">
                <input
                  type="text"
                  placeholder="Expense Name"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                />
                <select
                  placeholder="Category"
                  value={newExpense.category}
                  style={{ width: "96%" }}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option value="Essential">Essential</option>
                  <option value="Spending">Spending</option>
                </select>
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
                <button className="addButton" onClick={() => { handleAddExpense(); closeModal2(); }}>Add Expense</button>
              </div>
            </div>
          </div>
        </Modal>

        <button
        className="openAddEventBtn"
        onClick={() => {openModal3(true);}}
        id='3'/>
        <Modal
          className="modalContainer"
          isOpen={modal3Open}
          onRequestClose={closeModal3}
          ariaHideApp={false}
        >
          <div className="titleCloseBtn">
            <button onClick={() => {closeModal3();}}> X </button>
          </div>

          <div className="eventForm">
            <h2>Add Deposit</h2>
            <div /*ADD DEPOSIT */ className="add-event-container">
              <div className="add-event">
                <input
                  type="number"
                  placeholder="Enter Balance"
                  value={updatedBalance}
                  onChange={(e) => setUpdatedBalance(parseInt(e.target.value))}
                />
                <button className="addButton" onClick={() => { handleUpdateBalance(); closeModal3(); }}>Add Deposit</button>
              </div>
            </div>
          </div>
        </Modal>

        <button
        className="openAddEventBtn"
        onClick={() => {openModal4(true);}}
        id='4'/>
        <Modal
          className="modalContainer"
          isOpen={modal4Open}
          onRequestClose={closeModal4}
          ariaHideApp={false}
        >
          <div className="titleCloseBtn">
            <button onClick={() => {closeModal4();}}> X </button>
          </div>

          <div className="eventForm">
            <h2>Add Recurring Bill</h2>
            <div /*ADD RECUR */ className="add-event-container">
              <div className="add-event">
                <input
                  type="text"
                  placeholder="Bill Name"
                  value={newRecur.name}
                  onChange={(e) => setNewRecurring({ ...newRecur, name: e.target.value })}
                />
                <select
                  placeholder="Category"
                  value={newRecur.category}
                  style={{ width: "96%" }}
                  onChange={(e) => setNewRecurring({ ...newRecur, category: e.target.value })}
                >
                  <option value="Essential">Essential</option>
                  <option value="Spending">Spending</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newRecur.cost}
                  onChange={handleMinAmount}
                />
                <input
                  type="number"
                  placeholder="Renewal Date"
                  value={newRecur.date}
                  onChange={handleDateMax}
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={newRecur.frequency = 'monthly'}
                  onChange={(e) => setNewRecurring({ ...newRecur, frequency: e.target.value })}
                />
                <button className="addButton" onClick={() => { handleAddRecurring(); closeModal4(); }}>Add Bill</button>
              </div>
            </div>
          </div>
        </Modal>

        </div>
      </div>
    </div>
  );
}
