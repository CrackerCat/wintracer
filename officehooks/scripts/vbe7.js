function hookDispCall(moduleName) {
    hookFunction(moduleName, "DispCallFunc", {
        onEnter: function (args) {
            log_message("[+] DispCallFunc")
            var pvInstance = args[0]
            var oVft = args[1]
            var instance = ptr(ptr(pvInstance).readULong());

            log_message(' instance:' + instance);
            log_message(' oVft:' + oVft);
            var vftbPtr = instance.add(oVft)
            log_message(' vftbPtr:' + vftbPtr);
            var functionAddress = ptr(ptr(vftbPtr).readULong())

            var modules = Process.enumerateModules()

            var i
            for(i = 0; i < modules.length; i++) {
                if ( functionAddress >=  modules[i].base &&  functionAddress <= modules[i].base.add(modules[i].size)) {
                    log_message(" " + modules[i].name + ": " + modules[i].base + " " + modules[i].size + " " + modules[i].path)

                    var modName = modules[i].path
                    if (!(modName in loadedModules)) {                            
                        log_message("  DebugSymbol.loadModule " + modName);
                        var loadedModuleBase = DebugSymbol.loadModule(modName)
                        log_message("  DebugSymbol.loadModule loadedModuleBase: " + loadedModuleBase);                            
                        loadedModules[modName] = 1
                    }
                    break
                }
            }

            log_message(' functionAddress:' + functionAddress);
            var functionName = DebugSymbol.fromAddress(functionAddress)

            if (functionName) {
                log_message(' functionName:' + functionName);
            }

            dumpAddress(functionAddress);
            
            var currentAddress = functionAddress
            for(var i = 0; i < 10; i++) {
                try {
                    var instruction = Instruction.parse(currentAddress)
                    log_message(instruction.address + ': ' + instruction.mnemonic + ' ' + instruction.opStr)
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
            log_message("[+] rtcShell")
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
            log_message("[+] __vbaStrCat")
            // log_message('[+] ' + name);
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
            log_message('[+] __vbaStrComp');
            log_message(ptr(args[1]).readUtf16String())
            log_message(ptr(args[2]).readUtf16String())
        }
    })
}

function hookRtcCreateObject2(moduleName) {
    hookFunction(moduleName, "rtcCreateObject2", {
        onEnter: function (args) {
            log_message('[+] rtcCreateObject2');
            dumpAddress(args[0]);
            dumpBSTR(args[1]);
            log_message(ptr(args[2]).readUtf16String())
        },
        onLeave: function (retval) {
            dumpAddress(retval);
        }
    })
}
