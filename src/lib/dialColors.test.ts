import { describe, expect, test } from "vitest";

import { dialColors } from "./dialColors";

describe("getColorByDomain", () => {
  test("should return the color for a domain", () => {
    expect(dialColors("x.com")).toBe("#000");
  });
  test("should not return the color for a partial match", () => {
    expect(dialColors("somethingx.com")).not.toBe("#000");
  });
  test("should return the color for a subdomain", () => {
    expect(dialColors("www.google.com")).toBe("#689f38");
  });
  test("should return a random hex color if domain not in list", () => {
    expect(dialColors("example.com")).toBe("#512da8");
  });
});
