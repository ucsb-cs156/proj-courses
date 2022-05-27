import { hhmmTohhmma } from "main/utils/timeUtils";
  
describe("time conversion tests", () => {
    
    test("hhmmTohhmma AM test ", () => {
        expect(hhmmTohhmma("8:00")).toBe("8:00 AM");
    });

    test("hhmmTohhmma midnight test 1", () => {
        expect(hhmmTohhmma("0:00")).toBe("12:00 AM");
    });

})