function hookDispCall(moduleName) {
    hookFunction(moduleName, "DispCallFunc", {
        onEnter: function (args) {
            console.log("[+] DispCallFunc")
            var pvInstance = args[0]
            var oVft = args[1]
            var instance = ptr(ptr(pvInstance).readULong());

            console.log(' instance:' + instance);
            console.log(' oVft:' + oVft);
            var vftbPtr = instance.add(oVft)
            console.log(' vftbPtr:' + vftbPtr);
            var functionAddress = ptr(ptr(vftbPtr).readULong())

            var modules = Process.enumerateModules()

            var i
            for(i = 0; i < modules.length; i++) {
                if ( functionAddress >=  modules[i].base &&  functionAddress <= modules[i].base.add(modules[i].size)) {
                    console.log(" " + modules[i].name + ": " + modules[i].base + " " + modules[i].size + " " + modules[i].path)

                    var modName = modules[i].path
                    if (!(modName in loadedModules)) {                            
                        console.log("  DebugSymbol.loadModule " + modName);
                        var loadedModuleBase = DebugSymbol.loadModule(modName)
                        console.log("  DebugSymbol.loadModule loadedModuleBase: " + loadedModuleBase);                            
                        loadedModules[modName] = 1
                    }
                    break
                }
            }

            console.log(' functionAddress:' + functionAddress);
            var functionName = DebugSymbol.fromAddress(functionAddress)

            if (functionName) {
                console.log(' functionName:' + functionName);
            }

            dumpAddress(functionAddress);
            
            var currentAddress = functionAddress
            for(var i = 0; i < 10; i++) {
                try {
                    var instruction = Instruction.parse(currentAddress)
                    console.log(instruction.address + ': ' + instruction.mnemonic + ' ' + instruction.opStr)
                    currentAddress = instruction.next
                }
                catch(err)
                {
                    break
                }
            }
        }
    })
}

function hookRtcShell(moduleName) {
    hookFunction(moduleName, "rtcShell", {
        onEnter: function (args) {
            console.log("[+] rtcShell")
            var variantArg = ptr(args[0])
            dumpAddress(variantArg);
            var bstrPtr = ptr(variantArg.add(8).readULong())
            dumpBSTR(bstrPtr);
        }
    })
}

function hookVBAStrCat(moduleName) {
    hookFunction(moduleName, "__vbaStrCat", {
        onEnter: function (args) {
            console.log("[+] __vbaStrCat")
            // console.log('[+] ' + name);
            // dumpBSTR(args[0]);
            // dumpBSTR(args[1]);
        },
        onLeave: function (retval) {
            dumpBSTR(retval);
        }
    })
}

function hookVBAStrComp(moduleName) {
    hookFunction(moduleName, "__vbaStrComp", {
        onEnter: function (args) {
            console.log('[+] __vbaStrComp');
            console.log(ptr(args[1]).readUtf16String())
            console.log(ptr(args[2]).readUtf16String())
        }
    })
}

function hookRtcCreateObject2(moduleName) {
    hookFunction(moduleName, "rtcCreateObject2", {
        onEnter: function (args) {
            console.log('[+] rtcCreateObject2');
            dumpAddress(args[0]);
            dumpBSTR(args[1]);
            console.log(ptr(args[2]).readUtf16String())
        },
        onLeave: function (retval) {
            dumpAddress(retval);
        }
    })
}
