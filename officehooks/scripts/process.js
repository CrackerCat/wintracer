
// BOOL CreateProcessA(
//   LPCSTR                lpApplicationName,
//   LPSTR                 lpCommandLine,
//   LPSECURITY_ATTRIBUTES lpProcessAttributes,
//   LPSECURITY_ATTRIBUTES lpThreadAttributes,
//   BOOL                  bInheritHandles,
//   DWORD                 dwCreationFlags,
//   LPVOID                lpEnvironment,
//   LPCSTR                lpCurrentDirectory,
//   LPSTARTUPINFOA        lpStartupInfo,
//   LPPROCESS_INFORMATION lpProcessInformation
// );


function hookCreateProcessA(moduleName) {
    hookFunction(moduleName, "CreateProcessA", {
        onEnter: function (args) {
            console.log("[+] CreateProcessA")
            console.log(" " + ptr(args[0]).readCString())
            console.log(" " + ptr(args[1]).readCString())
        }
    })
}

// BOOL CreateProcessW(
//   LPCWSTR               lpApplicationName,
//   LPWSTR                lpCommandLine,
//   LPSECURITY_ATTRIBUTES lpProcessAttributes,
//   LPSECURITY_ATTRIBUTES lpThreadAttributes,
//   BOOL                  bInheritHandles,
//   DWORD                 dwCreationFlags,
//   LPVOID                lpEnvironment,
//   LPCWSTR               lpCurrentDirectory,
//   LPSTARTUPINFOW        lpStartupInfo,
//   LPPROCESS_INFORMATION lpProcessInformation
// );

function hookCreateProcessW(moduleName) {
    hookFunction(moduleName, "CreateProcessW", {
        onEnter: function (args) {
            console.log("[+] CreateProcessW")
            console.log(" " + ptr(args[0]).readUtf16String())
            console.log(" " + ptr(args[1]).readUtf16String())
        }
    })
}
