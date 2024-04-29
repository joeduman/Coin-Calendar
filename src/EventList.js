import React from "react";
import "./pages/css/home.css";

const EventList = ({ events }) => {
  // Define a max height for the event list container and set overflow to auto to enable scrolling.


  return (
    <div className="event-list">
      {events.map((event, index) => (
        <p
          key={index}
          style={{
            color: event.isExpense ? "orange" : "blue", // Use orange for expenses, blue for events
          }}
        >
          ━ {event.title} ━━━━ {event.spendingQuota}
        </p>
      ))}
    </div>
  );
};

export default EventList;
