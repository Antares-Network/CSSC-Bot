import { expect, describe, it, beforeEach } from "@jest/globals";
import { cleanRoleString } from "../../src/utils/roles";

//cleanRoleString
describe("cleanRoleString", () => {
  it("should lowercase the string", () => {
    expect(cleanRoleString("ABCD")).toEqual("abcd");
  });

  it("should remove special characters", () => {
    expect(cleanRoleString("a!b@c#d$")).toEqual("abcd");
  });

  it("should remove newlines", () => {
    expect(cleanRoleString("\na\n")).toEqual("a");
  });

  it("should replace whitespace with a hyphen", () => {
    expect(cleanRoleString("a b c")).toEqual("a-b-c");
  });

  it("should remove consecutive hyphens", () => {
    expect(cleanRoleString("a--b--c")).toBe("a-b-c");
  });

  it("should return an empty string for an empty input", () => {
    expect(cleanRoleString("")).toBe("");
  });

  it("cleanRoleString should return an empty string for a string with only special characters", () => {
    expect(cleanRoleString("!@#$%^&*")).toBe("");
  });

  it("should truncate the string to 100 characters", () => {
    expect(cleanRoleString("a".repeat(200))).toHaveLength(100);
  });
  it("should be able to handle a comboination of everything", () => {
    expect(cleanRoleString("a!  -- b@c\n#d$e%")).toEqual("a-bcde");
  });
});
