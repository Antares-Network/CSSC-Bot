import fs from "node:fs";

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