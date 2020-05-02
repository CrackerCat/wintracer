var loadedModules = {}
var resolvedAddresses = {}

function resolveName(dllName, name) {
    dllName = dllName.split('.')[0]

    var functionName = dllName + "!" + name

    if (functionName in resolvedAddresses) {
        return resolvedAddresses[functionName]
    }

    console.log("resolveName " + functionName);
    var addr = Module.findExportByName(dllName, name)

    if (!addr || addr.isNull()) {
        if (!(dllName in loadedModules)) {
            console.log(" DebugSymbol.loadModule " + dllName);
            DebugSymbol.loadModule(dllName)
            console.log(" DebugSymbol.loadModule finished");
            loadedModules[dllName] = 1
        }

        try {
            console.log(" DebugSymbol.getFunctionByName: " + functionName);
            addr = DebugSymbol.getFunctionByName(name)
            console.log(" DebugSymbol.getFunctionByName: addr = " + addr);
        }
        catch(err) {
            console.log(" DebugSymbol.getFunctionByName: Exception")
        }
    }

    resolvedAddresses[functionName] = addr
    return addr
}

var hookedFunctions = {}

function hookFunction(dllName, name, callback) {
    var functionName = dllName + "!" + name
    if (functionName in hookedFunctions) {
        return
    }

    hookedFunctions[functionName] = 1
    
    var addr = resolveName(dllName, name)
    if (!addr || addr.isNull()) {
        return
    }

    console.log(functionName + ': ' + addr);

    Interceptor.attach(addr, callback)
}