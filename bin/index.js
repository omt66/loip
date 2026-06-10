// src/utils/index.ts
import os from "os";
function getIPAddressesAndInterfacesMap() {
  let interfaces = os.networkInterfaces();
  let ipMap = {};
  for (let interfaceName in interfaces) {
    let iface = interfaces[interfaceName];
    if (iface) {
      for (let alias of iface) {
        let ipAddress = alias.address;
        if (!ipMap[ipAddress]) {
          let { family, internal } = alias;
          ipMap[ipAddress] = {
            address: ipAddress,
            family,
            internal,
            interfaceName
          };
        }
      }
    }
  }
  return ipMap;
}
async function getRemoteIPInfo() {
  return fetch("https://ipinfo.io/json").then((response) => response.json()).then((data) => data).catch(() => "Cannot fetch remote IP");
}
function displaySystemInfo() {
  let platform = os.platform();
  let release = os.release();
  let arch = os.arch();
  let hostname = os.hostname();
  let userInfo = os.userInfo();
  let cpus = os.cpus();
  let totalMemory = os.totalmem();
  let freeMemory = os.freemem();
  let totalMemoryGB = (totalMemory / (1024 * 1024 * 1024)).toFixed(2);
  let freeMemoryGB = (freeMemory / (1024 * 1024 * 1024)).toFixed(2);
  let osName = "?";
  if (platform === "win32") {
    osName = "Windows";
  } else if (platform === "darwin") {
    osName = "Mac OS";
  } else if (platform === "linux") {
    osName = "Linux";
  }
  console.log("=== System Information ===");
  console.log(`OS: ${osName} (platform: ${platform}, release: ${release}, architecture: ${arch})`);
  console.log(`CPU: ${cpus[0].model} (${cpus.length} cores)`);
  console.log(`Memory: ${totalMemoryGB} GB`);
  console.log(`Hostname: ${hostname}`);
  console.log(`User: ${userInfo.username} (UID: ${userInfo.uid})`);
}
async function displayIPAddresses() {
  let ipAddressMap = getIPAddressesAndInterfacesMap();
  let allEntries = Object.values(ipAddressMap);
  let ipv4Addresses = allEntries.filter((e) => e.family === "IPv4" && !e.internal).map((e) => e.address);
  let ipv6Addresses = allEntries.filter((e) => e.family === "IPv6" && !e.internal).map((e) => e.address);
  console.log(`
=== IP Address Information ===`);
  console.log("Local:");
  console.log("IPv4:");
  ipv4Addresses.forEach((ipAddress) => {
    let info = ipAddressMap[ipAddress];
    let { interfaceName } = info;
    console.log(` + ${ipAddress} (${interfaceName})`);
  });
  console.log("IPv6:");
  ipv6Addresses.forEach((ipAddress) => {
    let info = ipAddressMap[ipAddress];
    let { interfaceName } = info;
    console.log(` + ${ipAddress} (${interfaceName})`);
  });
  let { ip, hostname, city, region, country, loc, org, postal } = await getRemoteIPInfo();
  console.log(`
Remote:`);
  console.log(` + IP: ${ip} (${hostname})`);
  console.log(` + ISP: ${org}`);
  console.log(` + Location: ${city}, ${region}, ${country}, ${postal}`);
  console.log(` + Coordinates: ${loc}`);
}

// src/index.ts
function main() {
  displaySystemInfo();
  displayIPAddresses();
}
main();
