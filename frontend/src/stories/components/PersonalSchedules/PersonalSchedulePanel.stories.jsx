import React from "react";
import PersonalSchedulePanel from "main/components/PersonalSchedules/PersonalSchedulePanel";

// Sample events for the panel
const sampleEvents = [
  {
    id: "event-math-mon",
    title: "Math 101",
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    description: "Lecture",
  },
  {
    id: "event-cs-wed",
    title: "CS 101",
    day: "Wednesday",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    description: "Lab section",
  },
  {
    id: "event-hist-fri",
    title: "History 202",
    day: "Friday",
    startTime: "9:00 AM",
    endTime: "10:15 AM",
    description: "Discussion section for History",
  },
  {
    id: "event-short-tue",
    title: "Quick Sync",
    day: "Tuesday",
    startTime: "1:00 PM",
    endTime: "1:15 PM", // Very short event
    description: "Quick project update",
  },
];

export default {
  title: "components/PersonalSchedules/PersonalSchedulePanel",
  component: PersonalSchedulePanel,
  argTypes: {
    eventColor: { control: "color" },
    borderColor: { control: "color" },
  },
};

const Template = (args) => {
  return <PersonalSchedulePanel {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  Events: [],
  eventColor: "#d1ecf1",
  borderColor: "#bee5eb",
};

export const WithEvents = Template.bind({});
WithEvents.args = {
  Events: sampleEvents,
  eventColor: "#d1ecf1",
  borderColor: "#bee5eb",
};

export const CustomColors = Template.bind({});
CustomColors.args = {
  Events: sampleEvents.slice(0, 2), // Take a couple of events for this demo
  eventColor: "rgb(255, 223, 186)", // A light orange
  borderColor: "rgb(255, 204, 128)", // A darker orange
};
