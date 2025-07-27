
// Transform primary data to the format expected by TanStack React Table
// for a table with primary rows and sub-rows (secondaries).

const transformCourseData = (data) => {
    return data.map(course => {
        // Create the primary row data
        const primaryRow = {
            ...course.primary, // Spread primary fields
            courseId: course.courseId,
            title: course.title,
            quarter: course.quarter,
            description: course.description,
            // You might want to add a type identifier if subRows have different structures
            type: 'primary', 
            originalCourseData: course, // Keep a reference to the original for full details if needed
        };

        // Create sub-rows from secondaries
        const subRows = course.secondaries.map(secondary => ({
            ...secondary, // Spread secondary fields
            courseId: course.courseId, // Carry over some main course info
            title: course.title,
            quarter: course.quarter,
            type: 'secondary', // Identifier for sub-rows
        }));

        // Attach subRows to the primary row
        return {
            ...primaryRow,
            subRows: subRows.length > 0 ? subRows : undefined, // Only add subRows if they exist
        };
    });
};

export { transformCourseData } ;