import { hhmmTohhmma, convertToTimeRange } from "main/utils/timeUtils.js"

export const convertToFraction = (en1, en2) => {
    return (en1 != null && en2 != null) ? `${en1}/${en2}` : "";
}


// Takes a time location array and returns the locations
export const formatLocation = (timeLocationArray) => {
    let res = "";
    for (let index = 0; index < timeLocationArray.length; index++) {
        res += `${timeLocationArray[index].building} ${timeLocationArray[index].room}`;
        if (index + 1 < timeLocationArray.length) {
            res += `, `
        } 
    }
    return res;
}

// Takes a time location array and returns the days
export const formatDays = (timeLocationArray) => {
    let res = "";
    for (let index = 0; index < timeLocationArray.length; index++) {
        res += (timeLocationArray[index].days !== null) ? `${timeLocationArray[index].days}` : "";
        if (index + 1 < timeLocationArray.length && timeLocationArray[index].days !== null) {
            res += `, `
        } 
    }
    return res;
}

// Takes a time location array and returns the time range
export const formatTime = (timeLocationArray) => {
    let res = "";
    for (let index = 0; index < timeLocationArray.length; index++) {
        res += convertToTimeRange(hhmmTohhmma(timeLocationArray[index].beginTime), hhmmTohhmma(timeLocationArray[index].endTime));
        if (index + 1 < timeLocationArray.length) {
            res += `, `
        } 
    }
    return res;
}

// Takes a instructors array and returns the instructors
export const formatInstructors = (instructorArray) => {
    let res = "";
    for (let index = 0; index < instructorArray.length; index++) {
        res += `${instructorArray[index].instructor}`;
        if (index + 1 < instructorArray.length) {
            res += `, `
        } 
    }
    return res;
}

// 
export const isSectionAsString = (en1) => {
    return (en1.substring(2) !== "00") ? "Yes" : "No";
}