import { describe, expect, test } from "vitest";

import {
  getUnseenWhatsNewFeatures,
  hasUnseenWhatsNewFeatures,
} from "./whatsNew";

describe("versioned What's New features", () => {
  test("shows features newer than the acknowledged release", () => {
    const features = getUnseenWhatsNewFeatures("2.16.0", "2.17.0");

    expect(features.map(({ title }) => title)).toEqual([
      "Quick Search",
      "Improved navigation",
      "Hide the Settings icon",
    ]);
    expect(hasUnseenWhatsNewFeatures("2.16.0", "2.17.0")).toBe(true);
  });

  test("hides features from the acknowledged release and older", () => {
    expect(getUnseenWhatsNewFeatures("2.17.0", "2.17.0")).toEqual([]);
    expect(hasUnseenWhatsNewFeatures("2.17.0", "2.17.0")).toBe(false);
  });

  test("does not show features from a future app release", () => {
    expect(getUnseenWhatsNewFeatures("2.15.0", "2.16.0")).toEqual([]);
  });

  test("coerces abbreviated development cutoff versions", () => {
    expect(getUnseenWhatsNewFeatures("2.16", "2.17.0")).toHaveLength(3);
    expect(getUnseenWhatsNewFeatures("2.17", "2.17.0")).toEqual([]);
  });
});
