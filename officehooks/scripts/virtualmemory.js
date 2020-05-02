function hookVirtualAlloc(moduleName) {
    hookFunction(moduleName, "VirtualAlloc", {
        onEnter: function (args) {
            console.log("[+] VirtualAlloc")
            console.log("  lpAddress: " + args[0])
            console.log("  dwSize: " + args[1])            
            console.log("  flAllocationType: " + args[2])
            console.log("  flProtect: " + args[3])
        }
    })
}