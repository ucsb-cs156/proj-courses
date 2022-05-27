export const convertToFraction = (en1, en2) => {
    return (en1 != null && en2 != null) ? `${en1}/${en2}` : "";
}

export const spaceOut = (en1, en2) => {
    return `${en1} ${en2}`
}

export const isSectionAsString = (en1) => {
    return (en1[3] !== "0") ? "Yes" : "No";
}