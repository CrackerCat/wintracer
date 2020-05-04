// void __thiscall LRPC_ADDRESS::HandleRequest(
//     LRPC_ADDRESS *this,
//     struct _PORT_MESSAGE *a2,
//     struct RPCP_ALPC_MESSAGE_ATTRIBUTES *a3,
//     struct _PORT_MESSAGE *a4,
//     int a5
// )

function hookLRPC_ADDRES_HandleRequest(moduleName) {
    hookFunction(moduleName, "LRPC_ADDRESS::HandleRequest", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!LRPC_ADDRESS::HandleRequest")
            console.log(" a2: " + args[0])
            dumpPortMessage(ptr(args[0]))
        },
        onLeave: function (retval) {
        }
    })
}

// int __thiscall LRPC_ADDRESS::AlpcSend(
//     LRPC_ADDRESS *this,
//     struct _PORT_MESSAGE *a2,
//     int a3,
//     void *a4,
//     void *a5,
//     unsigned int a6,
//     struct LRPC_SYSTEM_HANDLE_DATA *a7
// )

function hookLRPC_ADDRES_AlpcSend(moduleName) {
    hookFunction(moduleName, "LRPC_ADDRESS::AlpcSend", {
        onEnter: function (args) {
            console.log("[+] " + moduleName+ "!LRPC_ADDRESS::AlpcSend")
            console.log(" a2: " + args[0])
            dumpPortMessage(ptr(args[0]))
        },
        onLeave: function (retval) {
        }
    })
}
