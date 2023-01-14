import { expect, describe, it, beforeEach, jest } from "@jest/globals";
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

jest.mock("discord.js", () => {
  return {
    GuildMember: jest.fn().mockImplementation(() => {
      return {
        roles: {
          cache: {
            has: jest.fn().mockReturnValue(true),
            get: jest.fn().mockReturnValue("mockedRole"),
            remove: jest.fn().mockImplementation(() => Promise.resolve()),
          },
        },
        user: {
          tag: jest.fn().mockReturnValue("mockedUser"),
        },
      };
    }),
    Role: jest.fn().mockImplementation(() => {
      return {
        ROLE_ID: jest.fn().mockReturnValue("mockedRoleId"),
        ROLE_NAME: jest.fn().mockReturnValue("mockedRoleName"),
      };
    }),
  };
});

jest.mock("mongoose", () => {
  return {
    Model: jest.fn().mockImplementation(() => {
      return {
        find: jest
          .fn()
          .mockImplementation(() =>
            Promise.resolve([{ ROLE_ID: "mockedRoleId" }])
          ),
      };
    }),
  };
});

jest.mock("chalk", () => {
  return {
    green: jest.fn().mockReturnValue("mockedGreen"),
    yellow: jest.fn().mockReturnValue("mockedYellow"),
  };
});

console.log = jest.fn();

describe("removeRole", () => {
  let removeRole: any;
  let member: any;
  let model: any;

  beforeEach(() => {
    jest.resetModules();
    removeRole = require("./removeRole").removeRole;
    member = new (require("discord.js").GuildMember)();
    model = new (require("mongoose").Model)();
  });

  it("should remove role from member", async () => {
    await removeRole(member, model);
    expect(member.roles.cache.remove).toHaveBeenCalledWith("mockedRoleId");
    expect(console.log).toHaveBeenCalledWith(
      "mockedGreenRemoved role mockedGreenmockedRoleId from mockedYellowmockedUser"
    );
  });

  it("should return a promise that resolves to undefined", async () => {
    const result = await removeRole(member, model);
    expect(result).toBeUndefined();
  });
});
