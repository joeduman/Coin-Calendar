import React from "react";

const EventList = ({ events }) => {
  // Define a max height for the event list container and set overflow to auto to enable scrolling.
  const eventListStyle = {
    maxHeight: "200px", // Adjust this height as needed
    overflowY: "auto"
  };

  return (
    <div className="event-list" style={eventListStyle}>
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
