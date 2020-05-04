

// HRESULT __stdcall CStdIdentity::CreateServer(CStdIdentity *this, _GUID *rclsid, unsigned int clsctx, void *pv)

function hookCStdIdentityCreateServer(moduleName) {
    hookFunction(moduleName, "CStdIdentity::CreateServer", {
        onEnter: function (args) {
            console.log("[+] CStdIdentity::CreateServer")
            console.log(" this: " + args[0])
            var clsid = BytesToCLSID(ptr(args[1]))
            console.log(" rclsid: " + clsid)
            if (clsid in clsidNameMap) {
                console.log("  " + clsidNameMap[clsid])
            }

            console.log('CStdIdentity::CreateServer called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');                 
        }
    })
}

// CLIENT_CALL_RETURN __stdcall ObjectStublessClient(void *ParamAddress, int Method)

function dumpPointers(address, count) {
    if (address.isNull())
        return

    var currentAddress = address
    for(var i = 0; i < count; i++) {
        var readAddress = ptr(currentAddress).readPointer();
        readAddress = ptr(readAddress)
        var symbolInformation = DebugSymbol.fromAddress(readAddress)

        if (symbolInformation && symbolInformation.name) {
            console.log(currentAddress + ":\t" + readAddress + " " + symbolInformation.name)
        }else {
            console.log(currentAddress + ":\t" + readAddress)
        }

        dumpBytes(readAddress, 0x30)
        console.log("")
        currentAddress = currentAddress.add(4)
    }
}

function hookObjectStublessClient(moduleName) {
    hookFunction(moduleName, "ObjectStublessClient", {
        onEnter: function (args) {
            console.log("[+] ObjectStublessClient")
            console.log(" ParamAddress: " + args[0])
            // dumpPointers(args[0], 10)
            console.log(" Method: " + args[1])

            console.log('ObjectStublessClient called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');            
        }
    })
}

// .text:10175E25 ; HRESULT __thiscall CRpcResolver::CreateInstance(
//    CRpcResolver *this,
//    _COSERVERINFO *pServerInfo,
//    _GUID *pClsid,
//    unsigned int dwClsCtx,
//    unsigned int dwCount,
//    _GUID *pIIDs,
//    unsigned int *pdwDllServerModel,
//    wchar_t **ppwszDllServer,
//    tagMInterfacePointer **pRetdItfs,
//    HRESULT *pRetdHrs
// )

function hookCRpcResolverCreateInstance(moduleName) {
    hookFunction(moduleName, "CRpcResolver::CreateInstance", {
        onEnter: function (args) {
            console.log("[+] CRpcResolver::CreateInstance")
            console.log(" ParamAddress: " + args[0])
      
        }
    })
}
