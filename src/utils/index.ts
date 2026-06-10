import os from "os"

export interface IPInfoLocal {
    address: string
    family: string
    internal: boolean
    interfaceName: string
}

export interface IPInfoRemote {
    ip: string
    hostname: string
    city: string
    region: string
    country: string
    loc: string
    org: string
    postal: string
}

/**
 * Gets the IP addresses of the system, categorized into IPv4 and IPv6 addresses.
 * @returns An object containing arrays of IPv4 and IPv6 addresses.
 */
export function getIPAddresses(): { ipv4Addresses: string[], ipv6Addresses: string[] } {
    let interfaces = os.networkInterfaces()
    let ipv4Addresses: string[] = []
    let ipv6Addresses: string[] = []

    for (let interfaceName in interfaces) {
        let iface = interfaces[interfaceName]
        if (iface) {
            for (let alias of iface) {
                if (alias.family === "IPv4" && !alias.internal) {
                    ipv4Addresses.push(alias.address)
                } 
                else if (alias.family === "IPv6" && !alias.internal) {
                    ipv6Addresses.push(alias.address)
                }
            }
        }
    }

    return { ipv4Addresses, ipv6Addresses }
}

export function getIPAddressesAndInterfacesMap(): {[ipAddress: string]: IPInfoLocal} {
    let interfaces = os.networkInterfaces()
    let ipMap: {[ipAddress: string]: IPInfoLocal} = {}

    for (let interfaceName in interfaces) {
        let iface = interfaces[interfaceName]

        if (iface) {
            for (let alias of iface) {
                let ipAddress = alias.address
                if (!ipMap[ipAddress]) {
                    let {family, internal} = alias
                    ipMap[ipAddress] = { 
                        address: ipAddress, 
                        family, 
                        internal, 
                        interfaceName 
                    }
                }
            }
        }
    }

    return ipMap
}

/**
 * Gets the remote IP information by making a request to an external service (ipinfo.io).
 * @returns A promise that resolves to the remote IP information or an error message.
 */
export async function getRemoteIPInfo(): Promise<IPInfoRemote | string> {
    return fetch("https://ipinfo.io/json")
        .then(response => response.json())
        .then((data: IPInfoRemote|any) => data)
        .catch(() => "Cannot fetch remote IP")
}

/**
 * Displays the system information including operating system details, 
 * CPU information, and memory in GBs.
 */
export function displaySystemInfo() {
    let platform = os.platform()
    let release = os.release()
    let arch = os.arch()
    let hostname = os.hostname()
    let userInfo = os.userInfo()
    let cpus = os.cpus()
    let totalMemory = os.totalmem()
    let freeMemory = os.freemem()
    let totalMemoryGB = (totalMemory / (1024 * 1024 * 1024)).toFixed(2)
    let freeMemoryGB = (freeMemory / (1024 * 1024 * 1024)).toFixed(2)
    let osName = "?"

    if (platform === "win32") {
        osName = "Windows"
    } 
    else if (platform === "darwin") {
        osName = "Mac OS"
    }
    else if (platform === "linux") {
        osName = "Linux"
    }

    console.log("=== System Information ===")
    console.log(`OS: ${osName} (platform: ${platform}, release: ${release}, architecture: ${arch})`)
    console.log(`CPU: ${cpus[0]!.model} (${cpus.length} cores)`)
    console.log(`Memory: ${totalMemoryGB} GB`)
    console.log(`Hostname: ${hostname}`)
    console.log(`User: ${userInfo.username} (UID: ${userInfo.uid})`)
}

/**
 * Displays the IP addresses along with their corresponding network interfaces.
 */
export async function displayIPAddresses() {
    let ipAddressMap = getIPAddressesAndInterfacesMap()
    let { ipv4Addresses, ipv6Addresses } = getIPAddresses()
    
    console.log("\n=== IP Address Information ===")
    console.log("Local:")
    console.log("IPv4:")

    ipv4Addresses.forEach((ipAddress) => {
        let info = ipAddressMap[ipAddress]!
        let {interfaceName} = info
        console.log(` + ${ipAddress} (${interfaceName})`)
    })

    console.log("IPv6:")
    ipv6Addresses.forEach((ipAddress) => {
        let info = ipAddressMap[ipAddress]!
        let {interfaceName} = info
        console.log(` + ${ipAddress} (${interfaceName})`)
    })

    // Now let's get the remote IP information and display it...
    let {ip, hostname, city, region, country, loc, org, postal} = await getRemoteIPInfo() as IPInfoRemote
    console.log(`\nRemote:`)
    console.log(` + IP: ${ip} (${hostname})`)
    console.log(` + ISP: ${org}`)
    console.log(` + Location: ${city}, ${region}, ${country}, ${postal}`)
    console.log(` + Coordinates: ${loc}`)
}
