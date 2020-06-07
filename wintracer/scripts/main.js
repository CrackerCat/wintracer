var hookMap = {
    'VBE7.DLL': [
        hookRtcShell,
        hookRtcCreateObject2,
        hookVBAStrCat,
        hookVBAStrComp
    ],
    'OLEAUT32.DLL': [
        hookDispCall
    ],
    'kernel32.dll': [
        hookLoadLibraryA,
        hookLoadLibraryExA,
        hookLoadLibraryW,
        hookLoadLibraryExW,
        hookCreateProcessW,
        hookCreateProcessA,
        hookCreateFileW,
        hookWriteFile,
        hookWriteFileEx,
        hookMoveFile,
        // hookReadFile,
        // hookVirtualAlloc,
    ],
    'kernelbase.dll': [
        hookLoadLibraryA,
        hookLoadLibraryExA,
        hookLoadLibraryW,
        hookLoadLibraryExW,
        hookCreateProcessW,
        hookCreateProcessA,
        hookCreateFileW,
        hookWriteFile,
        hookWriteFileEx,
        hookMoveFile,
        // hookReadFile,
        // hookVirtualAlloc,
    ],
    'ole32': [
        hookCoCreateInstanceEx,
        hookCoCreateInstance,
        hookCDefObjectInitFromData, 
        // hookCDefObjectLoad,
        // hookCDefObjectRun,
        // hookReadOleStg,
        // hookStRead,
        // hookOLE32Funcs
    ],
    "rpcrt4": [
        hookLRPC_SCALL_LRPC_SCALL, 
        hookNdrClientInitializeNew,
        hookRpcBindingInqObject,
        hookI_RpcAsyncSetHandle,
        hookI_RpcBindingCreateNP,
        hookRpcBindingFromStringBindingA,
        hookRpcBindingFromStringBindingW,
        hookI_RpcSend,
        hookLRPC_ADDRES_HandleRequest,
        hookLRPC_ADDRES_AlpcSend,
        // hookRPCFunctions,
    ],
    "combase": [
        hookCStdIdentityCreateServer,
        hookObjectStublessClient
    ],
    "coml2": [
        // hookCExposedStreamRead,
        // hookComl2Functions,
        // hookCExposedStreamMethods
    ],
    "ntdll": [
        hookNtAlpcConnectPort,
        hookNtSecureConnectPort,
        hookNtAlpcConnectPortEx,
        hookNtConnectPort,
        hookNtAlpcAcceptConnectPort,
        hookNtAlpcSendWaitReceivePort,
        hookNtTerminateProcess
    ]
}


var hookMap = {

    'kernel32.dll': [
        hookVirtualProtect,
    ],
    'kernelbase.dll': [
        hookVirtualProtect,
    ]
}

for(var dllName in hookMap) {
    log_message("dllName: " + dllName)
    loadDLLHooks(dllName)
}
