import { describe, expect, it } from "bun:test";
import { gachafyMeCapn } from "./gachafy";

describe("gachafyMeCapn", () => {
  it("allows you to make an arbitrary number of pulls that returns an array of letters", () => {
    const pulls = gachafyMeCapn(10);

    console.log(pulls);
    expect(pulls).toHaveLength(10);
  });
});

describe("singlePull", () => {
  it("returns a single letter", () => {
    const pull = gachafyMeCapn(1);

    expect(pull).toHaveLength(1);
  });
});
