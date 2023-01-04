import axios from "axios";
import { Client } from "discord.js";
import { isDocker } from "../utils/docker";

export default (client: Client): void => {
  // Check if the bot is running in a docker container by checking if the env variable UPTIME_KUMA_CONTAINERIZED is true
  if (isDocker()) return;
  if (!process.env.UPTIME_KUMA_MONITOR_DOMAIN || !process.env.UPTIME_KUMA_MONITOR_ID) return;
  const updateStatus = async () => {
    // This function is called every 1 minutes and pings the network status page for uptime monitoring
    await axios.get(
      `https://${process.env.UPTIME_KUMA_MONITOR_DOMAIN}/api/push/${process.env.UPTIME_KUMA_MONITOR_ID}?msg=OK&ping=${client.ws.ping}`
    );
    setTimeout(updateStatus, 1000 * 60);
  };
  updateStatus().catch((err) => console.log(err));
};

export const config = {
  dbName: "STATUSPAGE_UPDATE",
  displayName: "Status Page Update",
};
