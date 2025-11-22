import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";

const html = readFileSync("index.html", "utf8");
const dom = new DOMParser().parseFromString(html, "text/html");

describe("index.html metadata tests", () => {
  test("title is 'UCSB Courses'", () => {
    const title = dom.querySelector("title");
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).toBe("UCSB Courses");
  });

  test("Storke Tower favicon is present", () => {
    const link = dom.querySelector("link[rel='icon']");
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("/tower-favicon.ico");
  });
});
