
// NTSYSCALLAPI NTSTATUS NTAPI 	NtAlpcConnectPort (
//    _Out_ PHANDLE PortHandle,
//    _In_ PUNICODE_STRING PortName,
//    _In_opt_ POBJECT_ATTRIBUTES ObjectAttributes,
//    _In_opt_ PALPC_PORT_ATTRIBUTES PortAttributes,
//    _In_ ULONG Flags,
//    _In_opt_ PSID RequiredServerSid,
//    _Inout_updates_bytes_to_opt_(*BufferLength,*BufferLength) PPORT_MESSAGE ConnectionMessage,
//    _Inout_opt_ PULONG BufferLength,
//    _Inout_opt_ PALPC_MESSAGE_ATTRIBUTES OutMessageAttributes,
//    _Inout_opt_ PALPC_MESSAGE_ATTRIBUTES InMessageAttributes,
//    _In_opt_ PLARGE_INTEGER Timeout
// )

function hookNtAlpcConnectPort(moduleName) {
    hookFunction(moduleName, "NtAlpcConnectPort", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NtAlpcConnectPort")
            console.log(" pPortHandle: " + args[0])
            this.pPortHandle = ptr(args[0])
            console.log(" PortName: " + args[1])
        },
        onLeave: function (retval) {
            console.log(" PortHandle: " + this.pPortHandle.readPointer())
        }
    })
}

// NTSYSCALLAPI NTSTATUS NTAPI NtAlpcConnectPortEx	(
//     _Out_ PHANDLE PortHandle,
//     _In_ POBJECT_ATTRIBUTES 	ConnectionPortObjectAttributes,
//     _In_opt_ POBJECT_ATTRIBUTES 	ClientPortObjectAttributes,
//     _In_opt_ PALPC_PORT_ATTRIBUTES 	PortAttributes,
//     _In_ ULONG 	Flags,
//     _In_opt_ PSECURITY_DESCRIPTOR 	ServerSecurityRequirements,
//     _Inout_updates_bytes_to_opt_ *,*BufferLength PPORT_MESSAGE 	ConnectionMessage,
//     _Inout_opt_ PSIZE_T 	BufferLength,
//     _Inout_opt_ PALPC_MESSAGE_ATTRIBUTES 	OutMessageAttributes,
//     _Inout_opt_ PALPC_MESSAGE_ATTRIBUTES 	InMessageAttributes,
//     _In_opt_ PLARGE_INTEGER 	Timeout 
// )

function hookNtAlpcConnectPortEx(moduleName) {
    hookFunction(moduleName, "NtAlpcConnectPortEx", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NtAlpcConnectPortEx")
            console.log(" pPortHandle: " + args[0])
            this.pPortHandle = ptr(args[0])
        },
        onLeave: function (retval) {
            console.log(" PortHandle: " + this.pPortHandle.readPointer())
        }
    })
}

// NTSYSCALLAPI NTSTATUS NTAPI NtAlpcAcceptConnectPort(
//    _Out_ PHANDLE PortHandle,
//    _In_ HANDLE ConnectionPortHandle,
//    _In_ ULONG Flags,
//    _In_opt_ POBJECT_ATTRIBUTES ObjectAttributes,
//    _In_opt_ PALPC_PORT_ATTRIBUTES PortAttributes,
//    _In_opt_ PVOID PortContext,
//    _In_reads_bytes_(ConnectionRequest->u1.s1.TotalLength) PPORT_MESSAGE ConnectionRequest,
//    _Inout_opt_ PALPC_MESSAGE_ATTRIBUTES ConnectionMessageAttributes,
//    _In_ BOOLEAN AcceptConnection
// )

function hookNtAlpcAcceptConnectPort(moduleName) {
    hookFunction(moduleName, "NtAlpcAcceptConnectPort", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NtAlpcAcceptConnectPort")
            console.log(" pPortHandle: " + args[0])
            this.pPortHandle = ptr(args[0])
        },
        onLeave: function (retval) {
            console.log(" PortHandle: " + this.pPortHandle.readPointer())
        }
    })
}


// NTSYSCALLAPI NTSTATUS NTAPI 	NtSecureConnectPort (_Out_ PHANDLE PortHandle, _In_ PUNICODE_STRING PortName, _In_ PSECURITY_QUALITY_OF_SERVICE SecurityQos, _Inout_opt_ PPORT_VIEW ClientView, _In_opt_ PSID RequiredServerSid, _Inout_opt_ PREMOTE_PORT_VIEW ServerView, _Out_opt_ PULONG MaxMessageLength, _Inout_updates_bytes_to_opt_(*ConnectionInformationLength,*ConnectionInformationLength) PVOID ConnectionInformation, _Inout_opt_ PULONG ConnectionInformationLength)

function hookNtSecureConnectPort(moduleName) {
    hookFunction(moduleName, "NtSecureConnectPort", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NtAlpcCNtSecureConnectPortonnectPort")
            console.log(" pPortHandle: " + args[0])
            this.pPortHandle = ptr(args[0])
            console.log(" PortName: " + args[1])
        },
        onLeave: function (retval) {
            console.log(" PortHandle: " + this.pPortHandle.readPointer())
        }
    })
}

// NTSYSCALLAPI NTSTATUS NTAPI 	NtConnectPort (_Out_ PHANDLE PortHandle, _In_ PUNICODE_STRING PortName, _In_ PSECURITY_QUALITY_OF_SERVICE SecurityQos, _Inout_opt_ PPORT_VIEW ClientView, _Inout_opt_ PREMOTE_PORT_VIEW ServerView, _Out_opt_ PULONG MaxMessageLength, _Inout_updates_bytes_to_opt_(*ConnectionInformationLength,*ConnectionInformationLength) PVOID ConnectionInformation, _Inout_opt_ PULONG ConnectionInformationLength)

function hookNtConnectPort(moduleName) {
    hookFunction(moduleName, "NtConnectPort", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NtConnectPort")
            console.log(" pPortHandle: " + args[0])
            this.pPortHandle = ptr(args[0])
            console.log(" PortName: " + args[1])
        },
        onLeave: function (retval) {
            console.log(" PortHandle: " + this.pPortHandle.readPointer())
        }
    })
}

// combase!_PORT_MESSAGE
//    +0x000 u1               : _PORT_MESSAGE::<unnamed-type-u1>
//       +0x000 s1               : _PORT_MESSAGE::<unnamed-type-u1>::<unnamed-type-s1>
//          +0x000 DataLength       : 0n536
//          +0x002 TotalLength      : 0n560
//       +0x000 Length           : 0x2300218
//    +0x004 u2               : _PORT_MESSAGE::<unnamed-type-u2>
//       +0x000 s2               : _PORT_MESSAGE::<unnamed-type-u2>::<unnamed-type-s2>
//          +0x000 Type             : 0n0
//          +0x002 DataInfoOffset   : 0n0
//       +0x000 ZeroInit         : 0
//    +0x008 ClientId         : _CLIENT_ID
//       +0x000 UniqueProcess    : (null) 
//       +0x004 UniqueThread     : (null) 
//    +0x008 DoNotUseThisField : 0 
//    +0x010 MessageId        : 0
//    +0x014 ClientViewSize   : 0
//    +0x014 CallbackId       : 0

var rpcRequestTypes = {
    0: "RPC_REQUEST_TYPE_CALL",
    1: "RPC_REQUEST_TYPE_BIND",
    2: "RPC_RESPONSE_TYPE_FAIL",
    3: "RPC_RESPONSE_TYPE_SUCCESS"
}

function dumpPortMessage(address) {
    console.log("PORT_MESSAGE @" + address)

    if (!address || address.isNull()) {
        return
    }

    var dataLength = address.readUShort()
    var totalLength = address.add(2).readUShort()
    dumpBytes(address, 0x28)

    if (dataLength > 0) {
        var payloadAddress = address.add(0x28)
        var request = payloadAddress.readULong()

        var request_type_str = ""
        if (request in rpcRequestTypes) {
            request_type_str = rpcRequestTypes[request]
        }

        console.log("request: " + request_type_str + " (" + request + ")")

        if (request == 1) {
            var clsid = BytesToCLSID(address.add(0x34))
            console.log("RPC CLSID: " + clsid)
        }

        dumpBytes(payloadAddress, dataLength)
    }
}

// NTSYSCALLAPI NTSTATUS NTAPI NtAlpcSendWaitReceivePort	(
//   _In_ HANDLE PortHandle,
//   _In_ ULONG Flags,
//   _In_reads_bytes_opt_(SendMessage->u1.s1.TotalLength) PPORT_MESSAGE SendMessage,
//   _Inout_opt_ PALPC_MESSAGE_ATTRIBUTES SendMessageAttributes,
//   _Out_writes_bytes_to_opt_ *(*BufferLength) PPORT_MESSAGE ReceiveMessage,
//   _Inout_opt_ PSIZE_T BufferLength,
//   _Inout_opt_ PALPC_MESSAGE_ATTRIBUTES ReceiveMessageAttributes,
//   _In_opt_ PLARGE_INTEGER Timeout 
// )

function hookNtAlpcSendWaitReceivePort(moduleName) {
    hookFunction(moduleName, "NtAlpcSendWaitReceivePort", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!NtAlpcSendWaitReceivePort")
            console.log(" PortHandle: " + args[0])
            console.log(" Flags: " + args[1])
            console.log(" SendMessage: " + args[2])

            this.pReceiveMessage = args[4]
            console.log(" pReceiveMessage: " + this.pReceiveMessage)
            
            dumpPortMessage(ptr(args[2]))
        },
        onLeave: function (retval) {
            if (this.pReceiveMessage != 0) {
                console.log(" ReceiveMessage: " + this.pReceiveMessage)
                dumpPortMessage(this.pReceiveMessage)
            }
        }
    })
}

