function hookVirtualAlloc(moduleName) {
    hookFunction(moduleName, "VirtualAlloc", {
        onEnter: function (args) {
            send("[+] VirtualAlloc")
            send("  lpAddress: " + args[0])
            send("  dwSize: " + args[1])            
            send("  flAllocationType: " + args[2])
            send("  flProtect: " + args[3])
        }
    })
}