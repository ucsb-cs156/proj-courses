import { render, screen } from "@testing-library/react";
import Footer, {space} from "main/components/Nav/Footer";

describe("Footer tests", () => {
    test("space stands for a space", () => {
        expect(space).toBe(" ");
      });
    
    
      test("renders without crashing", () => {
        render(<Footer />);
      });
    
      test("Links are correct", async () => {
        const { getByText } = render(<Footer />);
        expect(getByText("CMPSC 156").closest("a")).toHaveAttribute(
          "href",
          "https://ucsb-cs156.github.io"
        );
        expect(getByText("UCSB").closest("a")).toHaveAttribute(
          "href",
          "https://ucsb.edu"
        );
        expect(getByText(/GitHub/i).closest("a")).toHaveAttribute(
          "href",
          "https://github.com/ucsb-cs156-s22/s22-4pm-courses"
        );
      });
});
