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
            send('[+] ReadFile');
            send('  hFile: ' + args[0]);
            send('  lpBuffer: ' + args[1]);
            send('  nNumberOfBytesToRead: ' + args[2]);
            send('  lpNumberOfBytesRead: ' + args[3]);
            send('  lpOverlapped: ' + args[4]);

            this.lpBuffer = args[1];
            this.lpNumberOfBytesRead = args[3]
        },
        onLeave: function (retval) {
            send('[+] ReadFile returns: ' + retval);
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
            send('[+] CreateFileW');
            send('  lpFileName: ' + ptr(args[0]).readUtf16String());
            send('  dwDesiredAccess: ' + args[1]);
            send('  dwShareMode: ' + args[2]);
            send('  lpSecurityAttributes: ' + args[3]);
            send('  dwCreationDisposition: ' + args[4]);
            send('  dwFlagsAndAttributes: ' + args[5]);
            send('  hTemplateFile: ' + args[6]);

            this.lpBuffer = args[1];
            this.lpNumberOfBytesRead = args[3]
        },
        onLeave: function (retval) {
            send('[+] CreateFileW returns: ' + retval);
        }
    })
}
