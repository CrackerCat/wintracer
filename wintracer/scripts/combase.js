

// HRESULT __stdcall CStdIdentity::CreateServer(CStdIdentity *this, _GUID *rclsid, unsigned int clsctx, void *pv)

function hookCStdIdentityCreateServer(moduleName) {
    hookFunction(moduleName, "CStdIdentity::CreateServer", {
        onEnter: function (args) {
            log_message("[+] CStdIdentity::CreateServer")
            log_message(" this: " + args[0])
            var clsid = BytesToCLSID(ptr(args[1]))
            log_message(" rclsid: " + clsid)
            if (clsid in clsidNameMap) {
                log_message("  " + clsidNameMap[clsid])
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
            log_message(currentAddress + ":\t" + readAddress + " " + symbolInformation.name)
        }else {
            log_message(currentAddress + ":\t" + readAddress)
        }

        dumpBytes(readAddress, 0x30)
        log_message("")
        currentAddress = currentAddress.add(4)
    }
}

function hookObjectStublessClient(moduleName) {
    hookFunction(moduleName, "ObjectStublessClient", {
        onEnter: function (args) {
            log_message("[+] ObjectStublessClient")
            log_message(" ParamAddress: " + args[0])
            // dumpPointers(args[0], 10)
            log_message(" Method: " + args[1])

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
            log_message("[+] CRpcResolver::CreateInstance")
            log_message(" ParamAddress: " + args[0])
        }
    })
}
