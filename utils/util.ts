import { Client, MessageEmbed } from "discord.js";
import fs from "node:fs";

export function create_default_embed(
  client: Client,
  title: string,
  description: string
) {
  const color = "#0099ff";
  const thumbnail =
    "https://playantares.com/resources/CSSC-bot/cssc-server-icon.png";
  const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
  const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

  // Embed construction
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setThumbnail(thumbnail)
    .setDescription(description)
    .setFooter({ text: footer, iconURL: footerIcon });
  return embed;
}

export function sleep(ms: number) {
  // Create new promise that resolves itself after a delay of <ms>
  return new Promise((resolve: (args: void) => void) =>
    setTimeout(resolve, ms)
  );
}

//! This code was taken from the package `is-docker` and modified to work here with esm
//! Original repository: https://github.com/sindresorhus/is-docker
let isDockerCached: boolean;

function hasDockerEnv() {
  try {
    fs.statSync("/.dockerenv");
    return true;
  } catch {
    return false;
  }
}

function hasDockerCGroup() {
  try {
    return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return false;
  }
}

export function isDocker() {
  // TODO: Use `??=` when targeting Node.js 16.
  if (isDockerCached === undefined) {
    isDockerCached = hasDockerEnv() || hasDockerCGroup();
  }

  return isDockerCached;
}
