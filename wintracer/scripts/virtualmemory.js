function hookVirtualAlloc(moduleName) {
    hookFunction(moduleName, "VirtualAlloc", {
        onEnter: function (args) {
            log_message("[+] VirtualAlloc")
            log_message("  lpAddress: " + args[0])
            log_message("  dwSize: " + args[1])            
            log_message("  flAllocationType: " + args[2])
            log_message("  flProtect: " + args[3])
            log_message("  returnAddress: " + this.returnAddress)
            
        },
        onLeave: function (retval) {
            log_message("[+] VirtualAlloc: " + retval)
        }
    })
}

// BOOL VirtualProtect(
//   LPVOID lpAddress,
//   SIZE_T dwSize,
//   DWORD  flNewProtect,
//   PDWORD lpflOldProtect
// );

function hookVirtualProtect(moduleName) {
    hookFunction(moduleName, "VirtualProtect", {
        onEnter: function (args) {
            log_message("[+] VirtualProtect")
            log_message("  lpAddress: " + args[0])
            log_message("  dwSize: " + args[1])            
            log_message("  flNewProtect: " + args[2])
            log_message("  lpflOldProtect: " + args[3])
            
        }
    })
}