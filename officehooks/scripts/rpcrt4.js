// typedef struct _RPC_MESSAGE
// {
//     RPC_BINDING_HANDLE Handle;
//     ULONG DataRepresentation;
//     void* Buffer;
//     unsigned int BufferLength;
//     unsigned int ProcNum;
//     PRPC_SYNTAX_IDENTIFIER TransferSyntax;
//     void* RpcInterfaceInformation;
//     void* ReservedForRuntime;
//     RPC_MGR_EPV* ManagerEpv;
//     void* ImportContext;
//     ULONG RpcFlags;
// } RPC_MESSAGE, *PRPC_MESSAGE;

function dumpRPCMessage(address) {
    dumpAddress(address)
    var currentAddress = address
    var handle = currentAddress.readULong()
    currentAddress = currentAddress.add(8)

    var buffer = currentAddress.readPointer()
    currentAddress = currentAddress.add(4)
    var bufferLength = currentAddress.readULong()

    dumpBytes(buffer, bufferLength)
}

function hookRpcBindingFromStringBindingA(moduleName) {
    hookFunction(moduleName, "RpcBindingFromStringBindingA", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!RpcBindingFromStringBindingA")
            console.log(" StringBinding: " + ptr(args[0]).readCString())
            console.log(" PRPC_BINDING_HANDLE: " + args[1])
            this.binding = args[1]
        },
        onLeave: function (retval) {
            dumpBytes(this.binding, 0x20)
            var handle = ptr(this.binding).readULong()
            console.log(" RPC_BINDING_HANDLE: " + handle.toString(16))
            dumpBytes(ptr(handle), 0x20)
        }
    })
}

// RPC_STATUS RpcBindingFromStringBindingW(
//    RPC_WSTR           StringBinding,
//    RPC_BINDING_HANDLE *Binding
// );

function hookRpcBindingFromStringBindingW(moduleName) {
    hookFunction(moduleName, "RpcBindingFromStringBindingW", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!RpcBindingFromStringBindingW")
            console.log(" StringBinding: " + ptr(args[0]).readUtf16String())
            console.log(" PRPC_BINDING_HANDLE: " + args[1])
            this.rpcBindingHandlePtr = args[1]

        },
        onLeave: function (retval) {
            var rpcBindingHandle = ptr(this.rpcBindingHandlePtr).readPointer()
            console.log(" RPC_BINDING_HANDLE: " + rpcBindingHandle.toString(16))
            dumpBytes(rpcBindingHandle, 0x500)
        }
    })
}

function hookI_RpcBindingCreateNP(moduleName) {
    hookFunction(moduleName, "I_RpcBindingCreateNP", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!I_RpcBindingCreateNP")
            console.log(" ServerName: " + ptr(args[0]).readUtf16String())
            console.log(" ServiceName: " + ptr(args[1]).readUtf16String())
            console.log(" NetworkOptions: " + ptr(args[2]).readUtf16String())
            console.log(" PRPC_BINDING_HANDLE: " + args[3])
            this.binding = args[3]
        },
        onLeave: function (retval) {
            dumpBytes(this.binding, 0x20)
            console.log(" RPC_BINDING_HANDLE: " + ptr(this.binding).readULong().toString(16))
        }
    })
}

// RPC_STATUS __stdcall I_RpcAsyncSetHandle(PRPC_MESSAGE Message, PRPC_ASYNC_STATE pAsync)

function hookI_RpcAsyncSetHandle(moduleName) {
    hookFunction(moduleName, "I_RpcAsyncSetHandle", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!I_RpcAsyncSetHandle")
            console.log(" Message: " + args[0])
            dumpRPCMessage(ptr(args[0]))
            console.log(" pAsync: " + args[1])
        },
        onLeave: function (retval) {
        }
    })
}


// int __stdcall I_RpcBindingInqCurrentModifiedId(void *a1, struct _LUID *a2)
// RPC_STATUS __stdcall I_RpcBindingInqLocalClientPID(RPC_BINDING_HANDLE Binding, unsigned int *Pid)
// RPC_STATUS __stdcall I_RpcBindingInqTransportType(RPC_BINDING_HANDLE Binding, unsigned int *Type)

// unsigned int __stdcall I_RpcFreeSystemHandleCollection(LRPC_BASE_CCALL *a1, unsigned int a2)
// RPC_STATUS __stdcall I_RpcGetBuffer(RPC_MESSAGE *Message)
// RPC_STATUS __stdcall I_RpcGetBufferWithObject(RPC_MESSAGE *Message, UUID *ObjectUuid)
// unsigned __int8 *__stdcall NdrConformantStringUnmarshall(PMIDL_STUB_MESSAGE pStubMsg, unsigned __int8 **ppMemory, PFORMAT_STRING pFormat, unsigned __int8 fMustAlloc)

// void __stdcall NdrOutInit(PMIDL_STUB_MESSAGE pStubMsg, PFORMAT_STRING pFormat, struct _MIDL_STUB_MESSAGE *a3)
// void __stdcall NdrPointerBufferSize(PMIDL_STUB_MESSAGE pStubMsg, unsigned __int8 *pMemory, PFORMAT_STRING pFormat)

// unsigned __int8 *__stdcall NdrPointerMarshall(PMIDL_STUB_MESSAGE pStubMsg, unsigned __int8 *pMemory, PFORMAT_STRING pFormat)
// NdrPointerUnmarshall
// unsigned __int8 *__stdcall NdrServerInitialize(PRPC_MESSAGE pRpcMsg, PMIDL_STUB_MESSAGE pStubMsg, PMIDL_STUB_DESC pStubDescriptor)

function hookNdrServerInitialize(moduleName) {
    hookFunction(moduleName, "NdrServerInitialize", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NdrServerInitialize")
            console.log(" pRpcMsg: " + args[0])
            dumpRPCMessage(ptr(args[0]))
            console.log(" pStubMsg: " + args[1])
            console.log(" pStubDescriptor: " + args[2])   
        },
        onLeave: function (retval) {
        }
    })
}

// int __stdcall NdrStubCall2(void *pThis, void *pChannel, PRPC_MESSAGE pRpcMsg, unsigned int *pdwStubPhase)
// RpcAsyncIniRPC_STATUS __stdcall RpcAsyncInitializeHandle(PRPC_ASYNC_STATE pAsync, unsigned int Size)tializeHandle
// RPC_STATUS __stdcall RpcBindingInqObject(RPC_BINDING_HANDLE Binding, UUID *ObjectUuid)

function hookRpcBindingInqObject(moduleName) {
    hookFunction(moduleName, "RpcBindingInqObject", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!RpcBindingInqObject")
            console.log(" PRPC_BINDING_HANDLE: " + args[0])
            console.log(" ObjectUuid: " + args[1])
            this.pObjectUuid = ptr(args[1])
        },
        onLeave: function (retval) {
            var clsid = BytesToCLSID(ptr(this.pObjectUuid))
            console.log(" UUID: " + clsid)            
        }
    })
}

// RPC_STATUS __stdcall RpcServerInqCallAttributesW(RPC_BINDING_HANDLE ClientBinding, void *RpcCallAttributes)
// RPC_STATUS __stdcall RpcServerTestCancel(RPC_BINDING_HANDLE BindingHandle)


// void __stdcall NdrClientInitializeNew(
//     PRPC_MESSAGE pRpcMsg,
//     PMIDL_STUB_MESSAGE pStubMsg,
//     PMIDL_STUB_DESC pStubDescriptor,
//     unsigned int ProcNum
// )

function hookNdrClientInitializeNew(moduleName) {
    hookFunction(moduleName, "NdrClientInitializeNew", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NdrClientInitializeNew")
            console.log(" pRpcMsg: " + args[0])
            console.log(" pStubMsg: " + args[1])
            console.log(" pStubDescriptor: " + args[2])
            console.log(" ProcNum: " + args[3])
        }
    })
}

// RPC_STATUS I_RpcSend
// (
//   PRPC_MESSAGE pMsg
// )

function hookI_RpcSend(moduleName) {
    hookFunction(moduleName, "I_RpcSend", {
        onEnter: function (args) {
            console.log("[+] I_RpcSend")
            console.log(" args[0]: " + args[0])

            var rpcBindingHandle = ptr(ptr(args[0]).readPointer())
            console.log(" RPC_BINDING_HANDLE: " + rpcBindingHandle.toString(16))
            dumpBytes(rpcBindingHandle, 0x500)

            // console.log('CallStack:\n' +
            //     Thread.backtrace(this.context, Backtracer.ACCURATE)
            //     .map(DebugSymbol.fromAddress).join('\n') + '\n');
            
            dumpRPCMessage(ptr(args[0]))
        }
    })
}

// LRPC_SCALL *__thiscall LRPC_SCALL::LRPC_SCALL(LRPC_SCALL *this, int *a2, struct LRPC_SASSOCIATION *a3, unsigned int a4)

function hookLRPC_SCALL_LRPC_SCALL(moduleName) {
    hookFunction(moduleName, "LRPC_SCALL::LRPC_SCALL", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!LRPC_SCALL::LRPC_SCALL")
            console.log(" this: " + args[0])
            console.log(" a2: " + args[1])
            console.log(" a3: " + args[2])
            console.log(" a4: " + args[3])
        },
        onLeave: function (retval) {      
            console.log(" RPC_BINDING_HANDLE: " + retval)
        }
    })
}

function hookRPCFunctions(moduleName) {
    var functionNames = [
        "I_RpcAllocate",
        "I_RpcAsyncAbortCall",
        "I_RpcAsyncSetHandle",
        "I_RpcBCacheAllocate",
        "I_RpcBCacheFree",
        "I_RpcBindingCopy",
        // "I_RpcBindingCreateNP",
        "I_RpcBindingHandleToAsyncHandle",
        "I_RpcBindingInqClientTokenAttributes",
        "I_RpcBindingInqCurrentModifiedId",
        "I_RpcBindingInqDynamicEndpoint",
        "I_RpcBindingInqDynamicEndpointA",
        "I_RpcBindingInqDynamicEndpointW",
        "I_RpcBindingInqLocalClientPID",
        "I_RpcBindingInqMarshalledTargetInfo",
        "I_RpcBindingInqSecurityContext",
        "I_RpcBindingInqSecurityContextKeyInfo",
        "I_RpcBindingInqTransportType",
        "I_RpcBindingInqWireIdForSnego",
        "I_RpcBindingIsClientLocal",
        "I_RpcBindingIsServerLocal",
        "I_RpcBindingSetPrivateOption",
        "I_RpcBindingToStaticStringBindingW",
        "I_RpcCertProcessAndProvision",
        "I_RpcClearMutex",
        "I_RpcCompleteAndFree",
        "I_RpcConnectionInqSockBuffSize",
        "I_RpcConnectionSetSockBuffSize",
        "I_RpcDeleteMutex",
        "I_RpcEnableWmiTrace",
        "I_RpcExceptionFilter",
        "I_RpcFilterDCOMActivation",
        "I_RpcFree",
        "I_RpcFreeBuffer",
        "I_RpcFreePipeBuffer",
        "I_RpcFreeSystemHandle",
        "I_RpcFreeSystemHandleCollection",
        "I_RpcFwThisIsTheManager",
        "I_RpcGetBuffer",
        "I_RpcGetBufferWithObject",
        "I_RpcGetCurrentCallHandle",
        "I_RpcGetDefaultSD",
        "I_RpcGetExtendedError",
        "I_RpcGetPortAllocationData",
        "I_RpcGetSystemHandle",
        "I_RpcIfInqTransferSyntaxes",
        "I_RpcInitFwImports",
        "I_RpcInitHttpImports",
        "I_RpcInitImports",
        "I_RpcInitNdrImports",
        "I_RpcLogEvent",
        "I_RpcMapWin32Status",
        "I_RpcMarshalBindingHandleAndInterfaceForNDF",
        "I_RpcMgmtEnableDedicatedThreadPool",
        "I_RpcMgmtQueryDedicatedThreadPool",
        "I_RpcNDRCGetWireRepresentation",
        "I_RpcNDRSContextEmergencyCleanup",
        "I_RpcNegotiateTransferSyntax",
        "I_RpcNsBindingSetEntryName",
        "I_RpcNsBindingSetEntryNameA",
        "I_RpcNsBindingSetEntryNameW",
        "I_RpcNsInterfaceExported",
        "I_RpcNsInterfaceUnexported",
        "I_RpcOpenClientProcess",
        "I_RpcOpenClientThread",
        "I_RpcParseSecurity",
        "I_RpcPauseExecution",
        "I_RpcReallocPipeBuffer",
        "I_RpcReceive",
        "I_RpcRecordCalloutFailure",
        "I_RpcRequestMutex",
        "I_RpcSNCHOption",
        "I_RpcSend",
        "I_RpcSendReceive",
        "I_RpcServerAllocateIpPort",
        "I_RpcServerCheckClientRestriction",
        "I_RpcServerDisableExceptionFilter",
        "I_RpcServerGetAssociationID",
        "I_RpcServerInqAddressChangeFn",
        "I_RpcServerInqLocalConnAddress",
        "I_RpcServerInqRemoteConnAddress",
        "I_RpcServerInqTransportType",
        "I_RpcServerIsClientDisconnected",
        "I_RpcServerRegisterForwardFunction",
        "I_RpcServerSetAddressChangeFn",
        "I_RpcServerStartService",
        "I_RpcServerSubscribeForDisconnectNotification",
        "I_RpcServerTurnOnOffKeepalives",
        "I_RpcServerUseProtseq2A",
        "I_RpcServerUseProtseq2W",
        "I_RpcServerUseProtseqEp2A",
        "I_RpcServerUseProtseqEp2W",
        "I_RpcSessionStrictContextHandle",
        "I_RpcSetDCOMAppId",
        "I_RpcSetSystemHandle",
        "I_RpcSsDontSerializeContext",
        "I_RpcSystemFunction001",
        "I_RpcSystemHandleTypeSpecificWork",
        "I_RpcTransConnectionAllocatePacket",
        "I_RpcTransConnectionFreePacket",
        "I_RpcTransConnectionReallocPacket",
        "I_RpcTransDatagramAllocate",
        "I_RpcTransDatagramAllocate2",
        "I_RpcTransDatagramFree",
        "I_RpcTransGetThreadEvent",
        "I_RpcTransGetThreadEventThreadOptional",
        "I_RpcTransIoCancelled",
        "I_RpcTransServerNewConnection",
        "I_RpcTurnOnEEInfoPropagation",
        "I_RpcVerifierCorruptionExpected",
        "I_UuidCreate",

        "RpcAsyncAbortCall",
        "RpcAsyncCancelCall",
        "RpcAsyncCompleteCall",
        "RpcAsyncGetCallStatus",
        "RpcAsyncInitializeHandle",
        "RpcAsyncRegisterInfo",
        "RpcBindingBind",
        "RpcBindingCopy",
        "RpcBindingCreateA",
        "RpcBindingCreateW",
        "RpcBindingFree",
        "RpcBindingFromStringBindingA",
        "RpcBindingFromStringBindingW",
        "RpcBindingInqAuthClientA",
        "RpcBindingInqAuthClientExA",
        "RpcBindingInqAuthClientExW",
        "RpcBindingInqAuthClientW",
        "RpcBindingInqAuthInfoA",
        "RpcBindingInqAuthInfoExA",
        "RpcBindingInqAuthInfoExW",
        "RpcBindingInqAuthInfoW",
        "RpcBindingInqObject",
        "RpcBindingInqOption",
        "RpcBindingReset",
        "RpcBindingServerFromClient",
        "RpcBindingSetAuthInfoA",
        "RpcBindingSetAuthInfoExA",
        "RpcBindingSetAuthInfoExW",
        "RpcBindingSetAuthInfoW",
        "RpcBindingSetObject",
        "RpcBindingSetOption",
        "RpcBindingToStringBindingA",
        "RpcBindingToStringBindingW",
        "RpcBindingUnbind",
        "RpcBindingVectorFree",
        "RpcCancelThread",
        "RpcCancelThreadEx",
        "RpcCertGeneratePrincipalNameA",
        "RpcCertGeneratePrincipalNameW",
        "RpcCertMatchPrincipalName",
        "RpcEpRegisterA",
        "RpcEpRegisterNoReplaceA",
        "RpcEpRegisterNoReplaceW",
        "RpcEpRegisterW",
        "RpcEpResolveBinding",
        "RpcEpUnregister",
        "RpcErrorAddRecord",
        "RpcErrorClearInformation",
        "RpcErrorEndEnumeration",
        "RpcErrorGetNextRecord",
        "RpcErrorGetNumberOfRecords",
        "RpcErrorLoadErrorInfo",
        "RpcErrorResetEnumeration",
        "RpcErrorSaveErrorInfo",
        "RpcErrorStartEnumeration",
        "RpcExceptionFilter",
        "RpcFreeAuthorizationContext",
        "RpcGetAuthorizationContextForClient",
        "RpcIfIdVectorFree",
        "RpcIfInqId",
        "RpcImpersonateClient",
        "RpcImpersonateClient2",
        "RpcImpersonateClientContainer",
        "RpcMgmtEnableIdleCleanup",
        "RpcMgmtEpEltInqBegin",
        "RpcMgmtEpEltInqDone",
        "RpcMgmtEpEltInqNextA",
        "RpcMgmtEpEltInqNextW",
        "RpcMgmtEpUnregister",
        "RpcMgmtInqComTimeout",
        "RpcMgmtInqDefaultProtectLevel",
        "RpcMgmtInqIfIds",
        "RpcMgmtInqServerPrincNameA",
        "RpcMgmtInqServerPrincNameW",
        "RpcMgmtInqStats",
        "RpcMgmtIsServerListening",
        "RpcMgmtSetAuthorizationFn",
        "RpcMgmtSetCancelTimeout",
        "RpcMgmtSetComTimeout",
        "RpcMgmtSetServerStackSize",
        "RpcMgmtStatsVectorFree",
        "RpcMgmtStopServerListening",
        "RpcMgmtWaitServerListen",
        "RpcNetworkInqProtseqsA",
        "RpcNetworkInqProtseqsW",
        "RpcNetworkIsProtseqValidA",
        "RpcNetworkIsProtseqValidW",
        "RpcNsBindingInqEntryNameA",
        "RpcNsBindingInqEntryNameW",
        "RpcObjectInqType",
        "RpcObjectSetInqFn",
        "RpcObjectSetType",
        "RpcProtseqVectorFreeA",
        "RpcProtseqVectorFreeW",
        // "RpcRaiseException",
        "RpcRevertContainerImpersonation",
        "RpcRevertToSelf",
        "RpcRevertToSelfEx",
        "RpcServerCompleteSecurityCallback",
        "RpcServerInqBindingHandle",
        "RpcServerInqBindings",
        "RpcServerInqCallAttributesA",
        "RpcServerInqCallAttributesW",
        "RpcServerInqDefaultPrincNameA",
        "RpcServerInqDefaultPrincNameW",
        "RpcServerInqIf",
        "RpcServerInterfaceGroupActivate",
        "RpcServerInterfaceGroupClose",
        "RpcServerInterfaceGroupCreateA",
        "RpcServerInterfaceGroupCreateW",
        "RpcServerInterfaceGroupDeactivate",
        "RpcServerInterfaceGroupInqBindings",
        "RpcServerListen",
        "RpcServerRegisterAuthInfoA",
        "RpcServerRegisterAuthInfoW",
        "RpcServerRegisterIf",
        "RpcServerRegisterIf2",
        "RpcServerRegisterIf3",
        "RpcServerRegisterIfEx",
        "RpcServerSubscribeForNotification",
        "RpcServerTestCancel",
        "RpcServerUnregisterIf",
        "RpcServerUnregisterIfEx",
        "RpcServerUnsubscribeForNotification",
        "RpcServerUseAllProtseqs",
        "RpcServerUseAllProtseqsEx",
        "RpcServerUseAllProtseqsIf",
        "RpcServerUseAllProtseqsIfEx",
        "RpcServerUseProtseqA",
        "RpcServerUseProtseqEpA",
        "RpcServerUseProtseqEpExA",
        "RpcServerUseProtseqEpExW",
        "RpcServerUseProtseqEpW",
        "RpcServerUseProtseqExA",
        "RpcServerUseProtseqExW",
        "RpcServerUseProtseqIfA",
        "RpcServerUseProtseqIfExA",
        "RpcServerUseProtseqIfExW",
        "RpcServerUseProtseqIfW",
        "RpcServerUseProtseqW",
        "RpcServerYield",
        "RpcSmAllocate",
        "RpcSmClientFree",
        "RpcSmDestroyClientContext",
        "RpcSmDisableAllocate",
        "RpcSmEnableAllocate",
        "RpcSmFree",
        "RpcSmGetThreadHandle",
        "RpcSmSetClientAllocFree",
        "RpcSmSetThreadHandle",
        "RpcSmSwapClientAllocFree",
        "RpcSsAllocate",
        "RpcSsContextLockExclusive",
        "RpcSsContextLockShared",
        "RpcSsDestroyClientContext",
        "RpcSsDisableAllocate",
        "RpcSsDontSerializeContext",
        "RpcSsEnableAllocate",
        "RpcSsFree",
        "RpcSsGetContextBinding",
        "RpcSsGetThreadHandle",
        "RpcSsSetClientAllocFree",
        "RpcSsSetThreadHandle",
        "RpcSsSwapClientAllocFree",
        "RpcStringBindingComposeA",
        "RpcStringBindingComposeW",
        "RpcStringBindingParseA",
        "RpcStringBindingParseW",
        "RpcStringFreeA",
        "RpcStringFreeW",
        "RpcTestCancel",
        "RpcUserFree",

        "NdrAllocate",
        "NdrAsyncClientCall",
        "NdrAsyncClientCall2",
        "NdrAsyncServerCall",
        "NdrByteCountPointerBufferSize",
        "NdrByteCountPointerFree",
        "NdrByteCountPointerMarshall",
        "NdrByteCountPointerUnmarshall",
        "NdrCStdStubBuffer2_Release",
        "NdrCStdStubBuffer_Release",
        "NdrClearOutParameters",
        "NdrClientCall",
        "NdrClientCall2",
        "NdrClientCall4",
        "NdrClientContextMarshall",
        "NdrClientContextUnmarshall",
        "NdrClientInitialize",
        "NdrClientInitializeNew",
        "NdrComplexArrayBufferSize",
        "NdrComplexArrayFree",
        "NdrComplexArrayMarshall",
        "NdrComplexArrayMemorySize",
        "NdrComplexArrayUnmarshall",
        "NdrComplexStructBufferSize",
        "NdrComplexStructFree",
        "NdrComplexStructMarshall",
        "NdrComplexStructMemorySize",
        "NdrComplexStructUnmarshall",
        "NdrConformantArrayBufferSize",
        "NdrConformantArrayFree",
        "NdrConformantArrayMarshall",
        "NdrConformantArrayMemorySize",
        "NdrConformantArrayUnmarshall",
        "NdrConformantStringBufferSize",
        "NdrConformantStringMarshall",
        "NdrConformantStringMemorySize",
        "NdrConformantStringUnmarshall",
        "NdrConformantStructBufferSize",
        "NdrConformantStructFree",
        "NdrConformantStructMarshall",
        "NdrConformantStructMemorySize",
        "NdrConformantStructUnmarshall",
        "NdrConformantVaryingArrayBufferSize",
        "NdrConformantVaryingArrayFree",
        "NdrConformantVaryingArrayMarshall",
        "NdrConformantVaryingArrayMemorySize",
        "NdrConformantVaryingArrayUnmarshall",
        "NdrConformantVaryingStructBufferSize",
        "NdrConformantVaryingStructFree",
        "NdrConformantVaryingStructMarshall",
        "NdrConformantVaryingStructMemorySize",
        "NdrConformantVaryingStructUnmarshall",
        "NdrContextHandleInitialize",
        "NdrContextHandleSize",
        "NdrConvert",
        "NdrConvert2",
        "NdrCorrelationFree",
        "NdrCorrelationInitialize",
        "NdrCorrelationPass",
        "NdrCreateServerInterfaceFromStub",
        "NdrDcomAsyncClientCall",
        "NdrDcomAsyncClientCall2",
        "NdrDcomAsyncStubCall",
        "NdrDllCanUnloadNow",
        // "NdrDllGetClassObject",
        "NdrDllRegisterProxy",
        "NdrDllUnregisterProxy",
        "NdrEncapsulatedUnionBufferSize",
        "NdrEncapsulatedUnionFree",
        "NdrEncapsulatedUnionMarshall",
        "NdrEncapsulatedUnionMemorySize",
        "NdrEncapsulatedUnionUnmarshall",
        "NdrFixedArrayBufferSize",
        "NdrFixedArrayFree",
        "NdrFixedArrayMarshall",
        "NdrFixedArrayMemorySize",
        "NdrFixedArrayUnmarshall",
        "NdrFreeBuffer",
        "NdrFullPointerFree",
        "NdrFullPointerInsertRefId",
        "NdrFullPointerQueryPointer",
        "NdrFullPointerQueryRefId",
        "NdrFullPointerXlatFree",
        "NdrFullPointerXlatInit",
        "NdrGetBaseInterfaceFromStub",
        "NdrGetBuffer",
        "NdrGetDcomProtocolVersion",
        "NdrGetSimpleTypeBufferAlignment",
        "NdrGetSimpleTypeBufferSize",
        "NdrGetSimpleTypeMemorySize",
        "NdrGetTypeFlags",
        "NdrGetUserMarshalInfo",
        "NdrInterfacePointerBufferSize",
        "NdrInterfacePointerFree",
        "NdrInterfacePointerMarshall",
        "NdrInterfacePointerMemorySize",
        "NdrInterfacePointerUnmarshall",
        "NdrMapCommAndFaultStatus",
        "NdrMesProcEncodeDecode",
        "NdrMesProcEncodeDecode2",
        "NdrMesProcEncodeDecode4",
        "NdrMesSimpleTypeAlignSize",
        "NdrMesSimpleTypeDecode",
        "NdrMesSimpleTypeEncode",
        "NdrMesTypeAlignSize",
        "NdrMesTypeAlignSize2",
        "NdrMesTypeDecode",
        "NdrMesTypeDecode2",
        "NdrMesTypeEncode",
        "NdrMesTypeEncode2",
        "NdrMesTypeFree2",
        "NdrNonConformantStringBufferSize",
        "NdrNonConformantStringMarshall",
        "NdrNonConformantStringMemorySize",
        "NdrNonConformantStringUnmarshall",
        "NdrNonEncapsulatedUnionBufferSize",
        "NdrNonEncapsulatedUnionFree",
        "NdrNonEncapsulatedUnionMarshall",
        "NdrNonEncapsulatedUnionMemorySize",
        "NdrNonEncapsulatedUnionUnmarshall",
        "NdrNsGetBuffer",
        "NdrNsSendReceive",
        "NdrOleAllocate",
        "NdrOleFree",
        "NdrOutInit",
        "NdrPartialIgnoreClientBufferSize",
        "NdrPartialIgnoreClientMarshall",
        "NdrPartialIgnoreServerInitialize",
        "NdrPartialIgnoreServerUnmarshall",
        "NdrPointerBufferSize",
        "NdrPointerFree",
        "NdrPointerMarshall",
        "NdrPointerMemorySize",
        "NdrPointerUnmarshall",
        "NdrProxyErrorHandler",
        "NdrProxyFreeBuffer",
        "NdrProxyGetBuffer",
        "NdrProxyInitialize",
        "NdrProxySendReceive",
        "NdrRangeUnmarshall",
        "NdrRpcSmClientAllocate",
        "NdrRpcSmClientFree",
        "NdrRpcSmSetClientToOsf",
        "NdrRpcSsDefaultAllocate",
        "NdrRpcSsDefaultFree",
        "NdrRpcSsDisableAllocate",
        "NdrRpcSsEnableAllocate",
        "NdrSendReceive",
        "NdrServerCall",
        "NdrServerCall2",
        "NdrServerContextMarshall",
        "NdrServerContextNewMarshall",
        "NdrServerContextNewUnmarshall",
        "NdrServerContextUnmarshall",
        "NdrServerInitialize",
        "NdrServerInitializeMarshall",
        "NdrServerInitializeNew",
        "NdrServerInitializePartial",
        "NdrServerInitializeUnmarshall",
        "NdrServerMarshall",
        "NdrServerUnmarshall",
        "NdrSimpleStructBufferSize",
        "NdrSimpleStructFree",
        "NdrSimpleStructMarshall",
        "NdrSimpleStructMemorySize",
        "NdrSimpleStructUnmarshall",
        "NdrSimpleTypeMarshall",
        "NdrSimpleTypeUnmarshall",
        "NdrStubCall",
        "NdrStubCall2",
        "NdrStubForwardingFunction",
        "NdrStubGetBuffer",
        "NdrStubInitialize",
        "NdrStubInitializeMarshall",
        "NdrTypeFlags",
        "NdrTypeFree",
        "NdrTypeMarshall",
        "NdrTypeSize",
        "NdrTypeUnmarshall",
        "NdrUnmarshallBasetypeInline",
        "NdrUserMarshalBufferSize",
        "NdrUserMarshalFree",
        "NdrUserMarshalMarshall",
        "NdrUserMarshalMemorySize",
        "NdrUserMarshalSimpleTypeConvert",
        "NdrUserMarshalUnmarshall",
        "NdrVaryingArrayBufferSize",
        "NdrVaryingArrayFree",
        "NdrVaryingArrayMarshall",
        "NdrVaryingArrayMemorySize",
        "NdrVaryingArrayUnmarshall",
        "NdrXmitOrRepAsBufferSize",
        "NdrXmitOrRepAsFree",
        "NdrXmitOrRepAsMarshall",
        "NdrXmitOrRepAsMemorySize",
        "NdrXmitOrRepAsUnmarshall",
        "NdrpCreateProxy",
        "NdrpCreateStub",
        "NdrpGetProcFormatString",
        "NdrpGetTypeFormatString",
        "NdrpGetTypeGenCookie",
        "NdrpMemoryIncrement",
        "NdrpReleaseTypeFormatString",
        "NdrpReleaseTypeGenCookie",
        "NdrpVarVtOfTypeDesc",

        "CStdStubBuffer_AddRef",
        "CStdStubBuffer_Connect",
        "CStdStubBuffer_CountRefs",
        "CStdStubBuffer_DebugServerQueryInterface",
        "CStdStubBuffer_DebugServerRelease",
        "CStdStubBuffer_Disconnect",
        "CStdStubBuffer_Invoke",
        "CStdStubBuffer_IsIIDSupported",
        "CStdStubBuffer_QueryInterface",

        "CreateProxyFromTypeInfo",
        "CreateStubFromTypeInfo",

        "DceErrorInqTextA",
        "DceErrorInqTextW",

        "DllGetClassObject",
        "DllRegisterServer",

        "IUnknown_AddRef_Proxy",
        "IUnknown_QueryInterface_Proxy",
        "IUnknown_Release_Proxy",

        "InitializeDLL",
        "MIDL_wchar_strcpy",
        "MIDL_wchar_strlen",
        "MesBufferHandleReset",
        "MesDecodeBufferHandleCreate",
        "MesDecodeIncrementalHandleCreate",
        "MesEncodeDynBufferHandleCreate",
        "MesEncodeFixedBufferHandleCreate",
        "MesEncodeIncrementalHandleCreate",
        "MesHandleFree",
        "MesIncrementalHandleReset",
        "MesInqProcEncodingId",
        "NDRCContextBinding",
        "NDRCContextMarshall",
        "NDRCContextUnmarshall",
        "NDRSContextMarshall",
        "NDRSContextMarshall2",
        "NDRSContextMarshallEx",
        "NDRSContextUnmarshall",
        "NDRSContextUnmarshall2",
        "NDRSContextUnmarshallEx",
        "NDRcopy",

        "SimpleTypeAlignment",
        "SimpleTypeBufferSize",
        "SimpleTypeMemorySize",
        "TowerConstruct",
        "TowerExplode",
        "UuidCompare",
        "UuidCreate",
        "UuidCreateNil",
        "UuidCreateSequential",
        "UuidEqual",
        "UuidFromStringA",
        "UuidFromStringW",
        "UuidHash",
        "UuidIsNil",
        "UuidToStringA",
        "UuidToStringW",        
    ]

    hookFunctionNames(moduleName, functionNames)
}