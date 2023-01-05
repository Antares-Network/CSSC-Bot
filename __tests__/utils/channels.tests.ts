import { cleanChannelString } from "../../utils/channels";
import { expect, describe, it } from "@jest/globals";

//cleanChannelString

describe("cleanChannelString", () => {
  it("should lowercase the string", () => {
    expect(cleanChannelString("ABCD")).toEqual("abcd");
  });

  it("should remove special characters", () => {
    expect(cleanChannelString("a!b@c#d$")).toEqual("abcd");
  });

  it('should replace "compsci " with "cs"', () => {
    expect(cleanChannelString("compsci ")).toEqual("cs");
  });

  it("should replace spaces and parentheses with hyphens", () => {
    expect(cleanChannelString("a b (c)")).toEqual("a-b-c");
  });
  it("should return an empty string for an empty input", () => {
    expect(cleanChannelString("")).toBe("");
  });

  it("cleanChannelString should return an empty string for a string with only special characters", () => {
    expect(cleanChannelString("!@#$%^&*")).toBe("");
  });

  it("should handle a mix of all transformations", () => {
    expect(cleanChannelString("Compsci a%$ 123!")).toEqual("csa-123");
  });
});
