import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach } from "vitest";

describe("Favicon", () => {
  beforeEach(() => {
    // read index.html
    const indexHtmlPath = path.resolve(__dirname, "../../../index.html");
    const html = fs.readFileSync(indexHtmlPath, "utf8");

    // inject into JSDOM
    document.documentElement.innerHTML = html;
  });

  it("loads the Storke Tower favicon", () => {
    const link = document.querySelector("link[rel='icon']");
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe("/tower-favicon.ico");
  });
});
