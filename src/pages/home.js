import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

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

export default function HomePage() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    spendingQuota: "",
    allDay: false // Added allDay property
  });
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState(events);
  const [balance, setBalance] = useState(0);
  const [expectedBalance, setExpectedBalance] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);

  useEffect(() => {
    setExpectedBalance(balance);
  }, [balance]);

  useEffect(() => {
    const totalSpending = allEvents.reduce((total, event) => {
      return total + parseInt(event.spendingQuota, 10);
    }, 0);
    setExpectedBalance(balance - totalSpending);
  }, [balance, allEvents]);

  function handleAddEvent() {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.spendingQuota) {
      alert("Please fill out all the fields.");
      return;
    }
    setAllEvents([...allEvents, newEvent]);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      description: "",
      spendingQuota: "",
      allDay: false
    });
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

  function handleRemoveEvent() {
    const updatedEvents = allEvents.filter(event => event !== selectedEvent);
    setAllEvents(updatedEvents);
    setSelectedEvent(null);
  }

  return (
    <div className="App">
      <h1>Coin Calendar</h1>
      <div className="container">
        <div className="add-event-container">
          <div className="add-event">
            <h2>Add New Event</h2>
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
                    dateFormat="h:mm aa"
                    onChange={(start) => setNewEvent({ ...newEvent, start })}
                  />
                  <DatePicker
                    placeholderText="End Time"
                    selected={newEvent.end}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    dateFormat="h:mm aa"
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
            <input
              type="text"
              placeholder="Spending Quota"
              value={newEvent.spendingQuota}
              onChange={(e) =>
                setNewEvent({ ...newEvent, spendingQuota: e.target.value })
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
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleEventClick}
          />
        </div>
      </div>
      {selectedEvent && (
        <div className="event-details">
          <h2>Event Details</h2>
          <p>Title: {selectedEvent.title}</p>
          <p>Start Date: {selectedEvent.start.toLocaleString()}</p>
          <p>End Date: {selectedEvent.end.toLocaleString()}</p>
          <p>Description: {selectedEvent.description}</p>
          <p>Spending Quota: {selectedEvent.spendingQuota}</p>
          <button onClick={handleCloseEventDetails}>Close</button>
          <button onClick={handleRemoveEvent}>Remove Event</button>
        </div>
      )}
    <a href="/">Go to login page (DEVTOOL)</a>
    </div>
  );
}