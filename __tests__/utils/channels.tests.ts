import {
  cleanChannelString,
  concatCategoryName,
  moveChannel,
  getCourseName,
  getTopic,
} from "../../src/utils/channels";
import { expect, describe, it, beforeEach } from "@jest/globals";
import { Guild, GuildChannel } from "discord.js";
import { IClass } from "../../src/models/classModel";

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

describe("getTopic", () => {
  const default_string = "This is a test";
  let course: IClass = {
    TITLE: default_string,
    INFO: default_string,
    id: default_string,
    NAME: default_string,
    DUPE: false,
    ROLE_NAME: default_string,
    ROLE_ID: default_string,
    CHANNEL_ID: default_string,
  };
  const extra_characters: number = 3;
  beforeEach(() => {
    course = {
      TITLE: default_string,
      INFO: default_string,
      id: default_string,
      NAME: default_string,
      DUPE: false,
      ROLE_NAME: default_string,
      ROLE_ID: default_string,
      CHANNEL_ID: default_string,
    };
  });

  it("should return a truncated string of the concatenated title and info", () => {
    course.TITLE = "Introduction to Mathematics";
    expect(getTopic(course)).toHaveLength(
      course.TITLE.length + course.INFO.length + extra_characters
    );
  });

  it("should not return a string longer than 1024 characters", () => {
    course.TITLE = "a".repeat(600);
    course.INFO = "b".repeat(600);
    expect(getTopic(course)).toHaveLength(1024);
  });

  it("should return a string of length 1024 if TITLE is 1025 characters", () => {
    course.TITLE = "a".repeat(1025);
    course.INFO = "";
    expect(getTopic(course)).toHaveLength(1024);
  });

  it("should return a string of length 1024 if INFO is 1025 characters", () => {
    course.TITLE = "";
    course.INFO = "b".repeat(1025);
    expect(getTopic(course)).toHaveLength(1024);
  });
});

// getCourseName
describe("getCourseName", () => {
  const default_string = "This is a test";
  it("should return the course name if DUPE is false", () => {
    const course: IClass = {
      id: default_string,
      NAME: "Math 101",
      TITLE: "Introduction to Mathematics",
      INFO: default_string,
      DUPE: false,
      ROLE_NAME: default_string,
      ROLE_ID: default_string,
      CHANNEL_ID: default_string,
    };
    expect(getCourseName(course)).toBe("Math 101");
  });

  it("should return the concatenated course name and title if DUPE is true", () => {
    const course: IClass = {
      id: default_string,
      NAME: "Math 101",
      TITLE: "Introduction to Mathematics",
      INFO: default_string,
      DUPE: true,
      ROLE_NAME: default_string,
      ROLE_ID: default_string,
      CHANNEL_ID: default_string,
    };
    expect(getCourseName(course)).toBe("Math 101-Introduction to Mathematics");
  });
});

//moveChannel
// Can only test pure functionality
describe("moveChannel", () => {
  it("should not move the channel if it is already in the specified category", async () => {
    // Set up the test so that the channel is already in the specified category
    const guild = {} as Guild;
    const category_name = "abcd";
    const channel = { parent: { name: category_name } } as GuildChannel;
    // Ensure that the channel was not moved
    expect(await moveChannel(guild, channel, category_name)).toBe(0);
  });
});

//concatCategoryName
describe("concatCategoryName", () => {
  it("should return the category name if the category number is 0", () => {
    expect(concatCategoryName("abcd", 0)).toBe("abcd");
  });

  it("should return the category name and number if the category number is not 0", () => {
    expect(concatCategoryName("abcd", 1)).toBe("abcd 1");
  });
});
