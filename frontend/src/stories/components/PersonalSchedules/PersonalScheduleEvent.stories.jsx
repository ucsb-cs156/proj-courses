import React from "react";
import PersonalScheduleEvent from "main/components/PersonalSchedules/PersonalScheduleEvent";

// Fixture data for a sample event
const sampleEvent = {
  id: "sample-event-1",
  title: "CS 156",
  description: "Lecture with Professor Conrad",
  day: "Monday", // Not directly used by PersonalScheduleEvent but good for context
  startTime: "2:00 PM",
  endTime: "3:15 PM", // 75 minutes
  actions: [
    {
      text: "More Info",
      variant: "info",
      callback: () => {
        alert("More Info Clicked!");
      },
    },
    {
      text: "Edit Event",
      variant: "primary",
      callback: () => {
        alert("Edit Event Clicked!");
      },
    },
  ],
};

const sampleShortEvent = {
  ...sampleEvent,
  id: "sample-short-event",
  endTime: "2:30 PM", // 30 minutes, time should not be visible on card
  actions: [],
};

const sampleVeryShortEvent = {
  ...sampleEvent,
  id: "sample-vshort-event",
  endTime: "2:15 PM", // 15 minutes, title and time not visible on card
  actions: [],
};

export default {
  title: "components/PersonalSchedules/PersonalScheduleEvent",
  component: PersonalScheduleEvent,
  argTypes: {
    eventColor: { control: "color" },
    borderColor: { control: "color" },
  },
};

const Template = (args) => {
  return (
    <div style={{ position: "relative", height: "200px", width: "150px" }}>
      {/* Position relative is important for absolute positioning of event */}
      <PersonalScheduleEvent {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  event: sampleEvent,
  eventColor: "#d1ecf1", // A light blue, similar to default in panel
  borderColor: "#bee5eb", // A matching border color
};

export const ShortEvent = Template.bind({});
ShortEvent.args = {
  event: sampleShortEvent,
  eventColor: "#ffeeba", // A light yellow
  borderColor: "#ffdf7e",
};

export const VeryShortEvent = Template.bind({});
VeryShortEvent.args = {
  event: sampleVeryShortEvent,
  eventColor: "#f5c6cb", // A light red
  borderColor: "#ed969e",
};

export const NoActions = Template.bind({});
NoActions.args = {
  event: { ...sampleEvent, id: "event-no-actions", actions: [] },
  eventColor: "#d4edda", // A light green
  borderColor: "#c3e6cb",
};
