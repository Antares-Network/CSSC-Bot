import fs from "node:fs";

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
