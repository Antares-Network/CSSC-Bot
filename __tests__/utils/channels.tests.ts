import { cleanChannelString } from "../../src/utils/channels";
import { expect, describe, it } from "@jest/globals";

//cleanChannelString

describe("cleanChannelString", () => {
  it("should lowercase the string", () => {
    expect(cleanChannelString("ABCD")).toEqual("abcd");
  });

  it("should remove special characters", () => {
    expect(cleanChannelString("a!b@c#d$")).toEqual("abcd");
  });

  it("should replace whitespace with a hyphen", () => {
    expect(cleanChannelString("a b c")).toEqual("a-b-c");
  });

  it("should remove consecutive hyphens", () => {
    expect(cleanChannelString("a--b--c")).toBe("a-b-c");
  });

  it("should return an empty string for an empty input", () => {
    expect(cleanChannelString("")).toBe("");
  });

  it("cleanChannelString should return an empty string for a string with only special characters", () => {
    expect(cleanChannelString("!@#$%^&*")).toBe("");
  });

  it("should truncate the string to 100 characters", () => {
    expect(cleanChannelString("a".repeat(200))).toHaveLength(100);
  });
});
