function hookDispCall(moduleName) {
    hookFunction(moduleName, "DispCallFunc", {
        onEnter: function (args) {
            send("[+] DispCallFunc")
            var pvInstance = args[0]
            var oVft = args[1]
            var instance = ptr(ptr(pvInstance).readULong());

            send(' instance:' + instance);
            send(' oVft:' + oVft);
            var vftbPtr = instance.add(oVft)
            send(' vftbPtr:' + vftbPtr);
            var functionAddress = ptr(ptr(vftbPtr).readULong())

            var modules = Process.enumerateModules()

            var i
            for(i = 0; i < modules.length; i++) {
                if ( functionAddress >=  modules[i].base &&  functionAddress <= modules[i].base.add(modules[i].size)) {
                    send(" " + modules[i].name + ": " + modules[i].base + " " + modules[i].size + " " + modules[i].path)

                    var modName = modules[i].path
                    if (!(modName in loadedModules)) {                            
                        send("  DebugSymbol.loadModule " + modName);
                        var loadedModuleBase = DebugSymbol.loadModule(modName)
                        send("  DebugSymbol.loadModule loadedModuleBase: " + loadedModuleBase);                            
                        loadedModules[modName] = 1
                    }
                    break
                }
            }

            send(' functionAddress:' + functionAddress);
            var functionName = DebugSymbol.fromAddress(functionAddress)

            if (functionName) {
                send(' functionName:' + functionName);
            }

            dumpAddress(functionAddress);
            
            var currentAddress = functionAddress
            for(var i = 0; i < 10; i++) {
                try {
                    var instruction = Instruction.parse(currentAddress)
                    send(instruction.address + ': ' + instruction.mnemonic + ' ' + instruction.opStr)
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
            send("[+] rtcShell")
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
            send("[+] __vbaStrCat")
            // send('[+] ' + name);
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
            send('[+] __vbaStrComp');
            send(ptr(args[1]).readUtf16String())
            send(ptr(args[2]).readUtf16String())
        }
    })
}

function hookRtcCreateObject2(moduleName) {
    hookFunction(moduleName, "rtcCreateObject2", {
        onEnter: function (args) {
            send('[+] rtcCreateObject2');
            dumpAddress(args[0]);
            dumpBSTR(args[1]);
            send(ptr(args[2]).readUtf16String())
        },
        onLeave: function (retval) {
            dumpAddress(retval);
        }
    })
}
