import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach } from "vitest";

describe("Document title", () => {
  beforeEach(() => {
    // read document title
    const indexHtmlPath = path.resolve(__dirname, "../../../index.html");
    const html = fs.readFileSync(indexHtmlPath, "utf8");

    // inject into JSDOM
    document.documentElement.innerHTML = html;
  });

  it("has title 'UCSB Courses'", () => {
    expect(document.title).toBe("UCSB Courses");
  });
});
