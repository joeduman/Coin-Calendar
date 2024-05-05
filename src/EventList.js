import React from "react";

const EventList = ({ events }) => {
  // Define a max height for the event list container and set overflow to auto to enable scrolling.
  const eventListStyle = {
    maxHeight: "200px", // Adjust this height as needed
    overflowY: "auto"
  };

  return (
    <div className="event-list" style={eventListStyle}>
      {events.map((event, index) => {
        let color;
        if (event.isExpense) {
          color = event.isDeposit ? "#63FF72" : "#FF6363";
        } else if (event.isRecur) {
          color = "#FFDD63";
        } else {
          color = "#D663FF";
        }
        return (
          <p
            key={index}
            style={{ color:"black" }}
          >
            {event.title} <p key={index} style={{ color, display: "inline" }}> ---------- </p> {event.spendingQuota}
          </p>
        );
      })}
    </div>
  );
};  

export default EventList;
