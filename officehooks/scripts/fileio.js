function hookReadFile(moduleName) {
    hookFunction(moduleName, "ReadFile", {
        onEnter: function (args) {
            // BOOL ReadFile(
            //  HANDLE       hFile,
            //  LPVOID       lpBuffer,
            //  DWORD        nNumberOfBytesToRead,
            //  LPDWORD      lpNumberOfBytesRead,
            //  LPOVERLAPPED lpOverlapped
            //);
            console.log('[+] ReadFile');
            console.log('  hFile: ' + args[0]);
            console.log('  lpBuffer: ' + args[1]);
            console.log('  nNumberOfBytesToRead: ' + args[2]);
            console.log('  lpNumberOfBytesRead: ' + args[3]);
            console.log('  lpOverlapped: ' + args[4]);

            this.lpBuffer = args[1];
            this.lpNumberOfBytesRead = args[3]
        },
        onLeave: function (retval) {
            console.log('[+] ReadFile returns: ' + retval);
            dumpAddress(this.lpBuffer);
        }
    })
}

function hookCreateFileW(moduleName) {
    hookFunction(moduleName, "CreateFileW", {
        onEnter: function (args) {
            // HANDLE CreateFileW(
            //     LPCWSTR               lpFileName,
            //     DWORD                 dwDesiredAccess,
            //     DWORD                 dwShareMode,
            //     LPSECURITY_ATTRIBUTES lpSecurityAttributes,
            //     DWORD                 dwCreationDisposition,
            //     DWORD                 dwFlagsAndAttributes,
            //     HANDLE                hTemplateFile
            //   );
            console.log('[+] CreateFileW');
            console.log('  lpFileName: ' + ptr(args[0]).readUtf16String());
            console.log('  dwDesiredAccess: ' + args[1]);
            console.log('  dwShareMode: ' + args[2]);
            console.log('  lpSecurityAttributes: ' + args[3]);
            console.log('  dwCreationDisposition: ' + args[4]);
            console.log('  dwFlagsAndAttributes: ' + args[5]);
            console.log('  hTemplateFile: ' + args[6]);

            this.lpBuffer = args[1];
            this.lpNumberOfBytesRead = args[3]
        },
        onLeave: function (retval) {
            console.log('[+] CreateFileW returns: ' + retval);
        }
    })
}
