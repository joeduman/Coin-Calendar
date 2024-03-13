import React from "react";

const EventList = ({ events }) => {
  return (
    <div className="event-list">
      {events.map((event, index) => (
        <p key={index} style={{ color: "red" }}>
          ━ {event.title} ━━━━ ${event.spendingQuota}
        </p>
      ))}
    </div>
  );
};

export default EventList;
