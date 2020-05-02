var loadedModules = {}
var resolvedAddresses = {}

function resolveName(dllName, name) {
    var moduleName = dllName.split('.')[0]
    var functionName = moduleName + "!" + name

    if (functionName in resolvedAddresses) {
        return resolvedAddresses[functionName]
    }

    send("resolveName " + functionName);
    send("Module.findExportByName " + dllName + " " + name);
    var addr = Module.findExportByName(dllName, name)

    if (!addr || addr.isNull()) {
        if (!(dllName in loadedModules)) {
            send(" DebugSymbol.loadModule " + dllName);
            var loadModuleResult = DebugSymbol.loadModule(dllName)
            send(" DebugSymbol.loadModule finished: " + loadModuleResult);
            loadedModules[dllName] = 1
        }

        try {
            send(" DebugSymbol.getFunctionByName: " + functionName);
            addr = DebugSymbol.getFunctionByName(name)
            send(" DebugSymbol.getFunctionByName: addr = " + addr);
        }
        catch(err) {
            send(" DebugSymbol.getFunctionByName: Exception")
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

    send('Interceptor.attach: ' + functionName + '@' + addr);
    Interceptor.attach(addr, callback)
}
