import assert from "node:assert";

import { describe, test } from "node:test";

import { dialColors } from "./dialColors.js";

describe("getColorByDomain", () => {
  test("should return the color for a domain", () => {
    assert.equal(dialColors("x.com"), "#000");
  });
  test("should not return the color for a partial match", () => {
    assert.notEqual(dialColors("somethingx.com"), "#000");
  });
  test("should return the color for a subdomain", () => {
    assert.equal(dialColors("www.google.com"), "#689f38");
  });
  test("should return a random hex color if domain not in list", () => {
    assert.equal(dialColors("example.com"), "#512da8");
  });
});
