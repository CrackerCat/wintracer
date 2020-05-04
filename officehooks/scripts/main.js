var hookMap = {
    'VBE7.DLL': [hookRtcShell, hookRtcCreateObject2, hookVBAStrCat, hookVBAStrComp],
    'OLEAUT32.DLL': [hookDispCall],
    'kernel32.dll': [hookLoadLibraryA, hookLoadLibraryExA, hookLoadLibraryW, hookLoadLibraryExW, hookCreateProcessW, hookCreateProcessA
                    ], // hookReadFile hookVirtualAlloc, hookCreateFileW, 
    'kernelbase.dll': [hookLoadLibraryA, hookLoadLibraryExA, hookLoadLibraryW, hookLoadLibraryExW, hookCreateProcessW, hookCreateProcessA
                     ], // hookReadFile hookVirtualAlloc, hookCreateFileW,
    'ole32': [hookOLE32Funcs, hookCoCreateInstanceEx, hookCoCreateInstance, hookCDefObjectInitFromData, 
        hookCDefObjectLoad, hookCDefObjectRun, hookReadOleStg, hookStRead],
    "rpcrt4": [hookI_RpcBindingCreateNP, hookRpcBindingFromStringBindingA, hookRpcBindingFromStringBindingW, hookI_RpcSend],
    "combase": [hookCStdIdentityCreateServer, hookObjectStublessClient],
    "coml2": [hookComl2Functions, hookCExposedStreamMethods, hookCExposedStreamRead]
}

for(var dllName in hookMap) {
    console.log("dllName: " + dllName)
    loadDLLHooks(dllName)
}
