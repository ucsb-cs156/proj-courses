import { hhmmTohhmma, convertToTimeRange } from "main/utils/timeUtils";
  
describe("time conversion tests", () => {
    
    test("hhmmTohhmma AM test", () => {
        expect(hhmmTohhmma("8:45")).toBe("8:45 AM");
    });

    test("hhmmTohhmma PM tes", () => {
        expect(hhmmTohhmma("20:10")).toBe("8:10 PM");
    });

    test("hhmmTohhmma midnight test", () => {
        expect(hhmmTohhmma("0:00")).toBe("12:00 AM");
    });

    test("hhmmTohhmma noon test", () => {
        expect(hhmmTohhmma("12:59")).toBe("12:59 PM");
    });

    test("hhmmTohhmma invalid hour test 1", () => {
        expect(() => { hhmmTohhmma("-1:00"); }).toThrow("invalid hour param");
    });

    test("hhmmTohhmma invalid hour test 2", () => {
        expect(() => { hhmmTohhmma("24:00"); }).toThrow("invalid hour param");
    });

    test("hhmmTohhmma invalid minute test 1", () => {
        expect(() => { hhmmTohhmma("23:-1"); }).toThrow("invalid minute param");
    });

    test("hhmmTohhmma invalid minute test 2", () => {
        expect(() => { hhmmTohhmma("12:60"); }).toThrow("invalid minute param");
    });
})

describe("time range conversion tests", () => {
    
    test("12:30 - 12:59", () => {
        expect(convertToTimeRange("12:30","12:59")).toBe("12:30 - 12:59");
    });

    test("null - 12:59", () => {
        expect(convertToTimeRange(null,"12:59")).toBe("");
    });

    test("null - null", () => {
        expect(convertToTimeRange(null,null)).toBe("");
    });

    test("12:59 - null", () => {
        expect(convertToTimeRange("12:59",null)).toBe("");
    });
})
