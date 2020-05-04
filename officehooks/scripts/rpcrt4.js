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
            console.log("[+] RpcBindingFromStringBindingA")
            console.log(" StringBinding: " + ptr(args[0]).readCString())
            console.log(" Binding: " + args[1])
            this.binding = args[1]
        },
        onLeave: function (retval) {
            dumpBytes(this.binding, 0x20)
            var handle = ptr(this.binding).readULong()
            console.log(" *Binding: " + handle.toString(16))
            dumpBytes(ptr(handle), 0x20)
        }
    })
}

function hookRpcBindingFromStringBindingW(moduleName) {
    hookFunction(moduleName, "RpcBindingFromStringBindingW", {
        onEnter: function (args) {
            console.log("[+] RpcBindingFromStringBindingW")
            console.log(" StringBinding: " + ptr(args[0]).readUtf16String())
            console.log(" Binding: " + args[1])
            this.binding = args[1]
        },
        onLeave: function (retval) {
            dumpBytes(this.binding, 0x20)
            var handle = ptr(this.binding).readULong()
            console.log(" *Binding: " + handle.toString(16))
            dumpBytes(ptr(handle), 0x20)
        }
    })
}

function hookI_RpcBindingCreateNP(moduleName) {
    hookFunction(moduleName, "I_RpcBindingCreateNP", {
        onEnter: function (args) {
            console.log("[+] I_RpcBindingCreateNP")
            console.log(" ServerName: " + ptr(args[0]).readUtf16String())
            console.log(" ServiceName: " + ptr(args[1]).readUtf16String())
            console.log(" NetworkOptions: " + ptr(args[2]).readUtf16String())
            console.log(" Binding: " + args[3])
            this.binding = args[3]
        },
        onLeave: function (retval) {
            dumpBytes(this.binding, 0x20)
            console.log(" *Binding: " + ptr(this.binding).readULong().toString(16))
        }
    })
}

function hookI_RpcSend(moduleName) {
    hookFunction(moduleName, "I_RpcSend", {
        onEnter: function (args) {
            console.log("[+] I_RpcSend")
            console.log(" args[0]: " + args[0])

            var handle = ptr(args[0]).readULong()
            console.log(" Binding: " + handle.toString(16))
            dumpBytes(ptr(handle), 0x20)
            
            dumpRPCMessage(ptr(args[0]))
        }
    })
}
