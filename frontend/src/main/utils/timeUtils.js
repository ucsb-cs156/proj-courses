export const hhmmTohhmma = (HHMM) => {
    var time = HHMM.split(':');
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var timeValue;

    if (minutes > 59 || minutes < 0) {
        throw new Error("invalid minute param");
    }

    if (hours > 12 && hours < 24) {
        timeValue= "" + (hours - 12);
    } else if (hours > 0 && hours <= 12) {
        timeValue= "" + hours;
    } else if (hours === 0) {
        timeValue= "12";
    } else { 
        throw new Error("invalid hour param");
    }
    
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? " PM" : " AM";  // get AM/PM
    
    return timeValue;
}

export const convertToTimeRange = (time1, time2) => {
    return (time1 !== null && time2 !== null) ? `${time1} - ${time2}` : "";
}