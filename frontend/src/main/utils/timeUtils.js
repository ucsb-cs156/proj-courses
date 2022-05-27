export const hhmmTohhmma = (HHMM) => {
    var time = HHMM.split(':');
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var timeValue;

    if (hours > 0 && hours <= 12) {
    timeValue= "" + hours;
    } else if (hours > 12) {
    timeValue= "" + (hours - 12);
    } else {
    timeValue= "12";
    }
    
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? " PM" : " AM";  // get AM/PM

    return timeValue;
}

export const convertToTimeRange = (time1, time2) => {
    return `${time1} - ${time2}`
}