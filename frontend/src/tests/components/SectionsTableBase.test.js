import { render } from "@testing-library/react";
import SectionsTableBase from "main/components/SectionsTableBase";

describe("SectionsTableBase tests", () => {

    const columns = [
        {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
        },
        {
            Header: 'Column 2',
            accessor: 'col2',
        },
        //add groupable columns
    ];
    
    test("renders an empty table without crashing", () => {
        render(
            <SectionsTableBase columns={columns} data={[]} group={false} />
        );
    });
})