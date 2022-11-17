import { render, screen } from "@testing-library/react";
import Plaintext from "main/components/Utils/Plaintext"

describe("Plaintext tests", () => {
    test("renders the correct text", async () => {
        // Arrange
        const text = "foo\nbar\n  baz"

        const [firstLine, ...rest] = text.split('\n')

        // Act
        render(
            <Plaintext text={text}  />
        );

        // Assert
        expect(await screen.findByText(firstLine)).toBeInTheDocument();
        rest.forEach(line => {
            expect(screen.getByText(line.trim())).toBeInTheDocument();
        });
    });

    test("works on null parameter", async () => {
        // Arrange
      
        // Act
        render(
            <Plaintext text={null}  />
        );

        // Assert
        expect(await screen.findByTestId("plaintext-empty")).toBeInTheDocument();
        const pre = screen.getByTestId("plaintext-empty");
        expect(pre).toHaveTextContent("");
    });


    test("works on non-text types", async () => {
        // Arrange
      
        // Act
        render(
            <Plaintext text={[30, "foo", true]}  />
        );

        // Assert
        expect(await screen.findByTestId("plaintext")).toBeInTheDocument();
        const pre = screen.getByTestId("plaintext");
        expect(pre).toHaveTextContent('[ 30, "foo", true]');
    });
});
