import {convertToFraction, isSectionAsString} from "main/utils/sectionUtils"

describe ("section utils tests", () => {
    test("convertToFraction one null test 1" , () => {
        expect(convertToFraction(null, "100")).toBe("");
    }); 

    test("convertToFraction one null test 2" , () => {
        expect(convertToFraction("100", null)).toBe("");
    }); 

    test("isSectionAsString yes test" , () => {
        expect(isSectionAsString("0104")).toBe("Yes");
    }); 
})