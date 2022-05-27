import OurTable from "main/components/OurTable";
// import { useBackendMutation } from "main/utils/useBackend";


export default function SectionTable({ article, _currentUser }) {


    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    // const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'quarter',
            accessor: 'Quarter', 
        },
        {
            Header: 'courseId',
            accessor: 'Course ID',
        },
        {
            Header: 'title',
            accessor: 'Title', 
        },
        {
            Header: 'subjectArea',
            accessor: 'Subject Area', 
        },
        {
            Header: 'enrollCode',
            accessor: 'Enroll Code', 
        },
        {
            Header: 'enrolledTotal',
            accessor: 'Total Enrolled',
        },
        {
            Header: 'maxEnroll',
            accessor: 'Max Enrolled',
        },
        {
            Header: 'room',
            accessor: 'Room',
        },
        {
            Header: 'building',
            accessor: 'Building',
        },
        {
            Header: 'days',
            accessor: 'Days',
        },
        {
            Header: 'beginTime',
            accessor: 'Begin Time',
        },
        {
            Header: 'endTime',
            accessor: 'End Time',
        },
        {
            Header: 'instructor',
            accessor: 'Instructor',
        }
    ];

    const testid = "SectionTable";

    const columnsToDisplay = columns;

    return <OurTable
        data={article}
        columns={columnsToDisplay}
        testid={testid}
    />;
};