var loadedModules = {}
var resolvedAddresses = {}

function resolveName(dllName, name) {
    var moduleName = dllName.split('.')[0]
    var functionName = moduleName + "!" + name

    if (functionName in resolvedAddresses) {
        return resolvedAddresses[functionName]
    }

    log_message("resolveName " + functionName);
    log_message("Module.findExportByName " + dllName + " " + name);
    var addr = Module.findExportByName(dllName, name)

    if (!addr || addr.isNull()) {
        if (!(dllName in loadedModules)) {
            log_message(" DebugSymbol.loadModule " + dllName);
            var loadModuleResult = DebugSymbol.loadModule(dllName)
            log_message(" DebugSymbol.loadModule finished: " + loadModuleResult);
            loadedModules[dllName] = 1
        }

        try {
            log_message(" DebugSymbol.getFunctionByName: " + functionName);
            addr = DebugSymbol.getFunctionByName(moduleName + '!' + name)
            log_message(" DebugSymbol.getFunctionByName: addr = " + addr);
        }
        catch(err) {
            log_message(" DebugSymbol.getFunctionByName: Exception")
        }
    }

    resolvedAddresses[functionName] = addr
    return addr
}

var hookedFunctions = {}
var addressToFunctions = {}
var blackListedFunctions = {'I_RpcClearMutex': 1}

function hookFunction(dllName, funcName, callback) {
    if (funcName in blackListedFunctions) {
        return
    }
    var symbolName = dllName + "!" + funcName
    if (symbolName in hookedFunctions) {
        return
    }
    hookedFunctions[symbolName] = 1
    
    var addr = resolveName(dllName, funcName)
    if (!addr || addr.isNull()) {
        return
    }

    if (addr in hookedFunctions) {
        return
    }
    hookedFunctions[addr] = 1    

    addressToFunctions[addr] = symbolName
    log_message('Interceptor.attach: ' + symbolName + '@' + addr);
    Interceptor.attach(addr, callback)
}

function loadDLLHooks(dllName) {
    if (dllName in hookMap) {

        try {
            if (Module.getBaseAddress(dllName).isNull()) {
                return
            }
        }
        catch(err)
        {
            return
        }

        var calls = hookMap[dllName]
        for(var i = 0 ; i < calls.length; i++) {
            calls[i](dllName)
        }
    }
}

function hookLoadLibraryA(moduleName) {
    hookFunction(moduleName, "LoadLibraryA", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readCString()
            log_message("[+] LoadLibraryA: " + this.targetDLLName)
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

function hookLoadLibraryExA(moduleName) {
    hookFunction(moduleName, "LoadLibraryExA", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readCString()
            log_message("[+] LoadLibraryExA: " + this.targetDLLName)
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

function hookLoadLibraryW(moduleName) {
    hookFunction(moduleName, "LoadLibraryW", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readUtf16String()
            log_message("[+] LoadLibraryW: " + this.targetDLLName)            
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

function hookLoadLibraryExW(moduleName) {
    hookFunction(moduleName, "LoadLibraryExW", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readUtf16String()
            log_message("[+] LoadLibraryExW: " + this.targetDLLName)            
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

function hookPointers(address, count) {
    if (address.isNull())
        return

    var currentAddress = address
    for(var i = 0; i < count; i++) {
        var readAddress = ptr(currentAddress).readPointer();
        readAddress = ptr(readAddress)
        var symbolInformation = DebugSymbol.fromAddress(readAddress)

        var name = readAddress
        if (symbolInformation && symbolInformation.name) {
            name = symbolInformation.name
        }

        log_message('Hooking ' + readAddress + ": " + name)

        try {
            Interceptor.attach(readAddress, {
                onEnter: function (args) {
                    log_message('[+] ' + name)
                }
            })
        }
        catch(err) {}
        currentAddress = currentAddress.add(4)
    }
}

function hookFunctionNames(moduleName, funcNames) {
    for(var i = 0; i < funcNames.length; i++) {
        var funcName = funcNames[i]

        try {
            hookFunction(moduleName, funcName, {
                onEnter: function (args) {
                    var name = ''
                    if ( this.context.pc in addressToFunctions) {
                        name = addressToFunctions[this.context.pc]
                    }
                    log_message("[+] " + name + " (" + this.context.pc + ")")
                }
            })
        } catch(err) {
            log_message("Failed to hook " + funcName)
        }
    }
}
