var hookMap = {
    // 'VBE7.DLL': [hookRtcShell, hookRtcCreateObject2, hookVBAStrCat, hookVBAStrComp],
    // 'OLEAUT32.DLL': [hookDispCall],
    'kernel32.dll': [
        hookLoadLibraryA,
        hookLoadLibraryExA,
        hookLoadLibraryW,
        hookLoadLibraryExW,
        hookCreateProcessW,
        hookCreateProcessA,
        // hookReadFile,
        // hookVirtualAlloc,
        // hookCreateFileW,
    ],
    'kernelbase.dll': [
        hookLoadLibraryA,
        hookLoadLibraryExA,
        hookLoadLibraryW,
        hookLoadLibraryExW,
        hookCreateProcessW,
        hookCreateProcessA,
        // hookReadFile,
        // hookVirtualAlloc,
        // hookCreateFileW,
    ],
    // 'ole32': [hookCoCreateInstanceEx, hookCoCreateInstance, hookCDefObjectInitFromData, 
        // hookCDefObjectLoad, hookCDefObjectRun, hookReadOleStg, hookStRead], // hookOLE32Funcs
    "rpcrt4": [
        hookLRPC_SCALL_LRPC_SCALL, 
        hookNdrClientInitializeNew,
        hookRpcBindingInqObject,
        hookI_RpcAsyncSetHandle,
        hookI_RpcBindingCreateNP,
        hookRpcBindingFromStringBindingA,
        hookRpcBindingFromStringBindingW,
        hookI_RpcSend, hookRPCFunctions,
        hookLRPC_ADDRES_HandleRequest,
        hookLRPC_ADDRES_AlpcSend
    ],
    // "combase": [hookCStdIdentityCreateServer, hookObjectStublessClient],
    // "coml2": [hookCExposedStreamRead] // hookComl2Functions, hookCExposedStreamMethods
    "ntdll": [
        hookNtAlpcConnectPort,
        hookNtSecureConnectPort,
        hookNtAlpcConnectPortEx,
        hookNtConnectPort,
        hookNtAlpcAcceptConnectPort,
        hookNtAlpcSendWaitReceivePort
    ]
}

for(var dllName in hookMap) {
    console.log("dllName: " + dllName)
    loadDLLHooks(dllName)
}
