// BOOL ReadFile(
//   HANDLE       hFile,
//   LPVOID       lpBuffer,
//   DWORD        nNumberOfBytesToRead,
//   LPDWORD      lpNumberOfBytesRead,
//   LPOVERLAPPED lpOverlapped
// );

function hookReadFile(moduleName) {
    hookFunction(moduleName, "ReadFile", {
        onEnter: function (args) {
            log_message('[+] ReadFile');
            log_message('  hFile: ' + args[0]);
            log_message('  lpBuffer: ' + args[1]);
            log_message('  nNumberOfBytesToRead: ' + args[2]);
            log_message('  lpNumberOfBytesRead: ' + args[3]);
            log_message('  lpOverlapped: ' + args[4]);

            this.lpBuffer = args[1];
            this.lpNumberOfBytesRead = args[3]
        },
        onLeave: function (retval) {
            log_message('[+] ReadFile returns: ' + retval);
            // dumpAddress(this.lpBuffer);
        }
    })
}

// BOOL WriteFile(
//   HANDLE       hFile,
//   LPCVOID      lpBuffer,
//   DWORD        nNumberOfBytesToWrite,
//   LPDWORD      lpNumberOfBytesWritten,
//   LPOVERLAPPED lpOverlapped
// );

function hookWriteFile(moduleName) {
    hookFunction(moduleName, "WriteFile", {
        onEnter: function (args) {
            log_message('[+] WriteFile');
            log_message('  hFile: ' + args[0]);
            log_message('  lpBuffer: ' + args[1]);
            log_message('  nNumberOfBytesToWrite: ' + args[2]);
            log_message('  lpNumberOfBytesWritten: ' + args[3]);
            log_message('  lpOverlapped: ' + args[4]);
        },
        onLeave: function (retval) {
            log_message('[+] WriteFile returns: ' + retval);
        }
    })
}

// BOOL WriteFileEx(
//   HANDLE                          hFile,
//   LPCVOID                         lpBuffer,
//   DWORD                           nNumberOfBytesToWrite,
//   LPOVERLAPPED                    lpOverlapped,
//   LPOVERLAPPED_COMPLETION_ROUTINE lpCompletionRoutine
// );

function hookWriteFileEx(moduleName) {
    hookFunction(moduleName, "WriteFileEx", {
        onEnter: function (args) {
            log_message('[+] WriteFileEx');
            log_message('  hFile: ' + args[0]);
            log_message('  lpBuffer: ' + args[1]);
            log_message('  nNumberOfBytesToWrite: ' + args[2]);
            log_message('  lpOverlapped: ' + args[3]);
            log_message('  lpCompletionRoutine: ' + args[4]);
        },
        onLeave: function (retval) {
            log_message('[+] returns: ' + retval);
        }
    })
}

// HANDLE CreateFileW(
//     LPCWSTR               lpFileName,
//     DWORD                 dwDesiredAccess,
//     DWORD                 dwShareMode,
//     LPSECURITY_ATTRIBUTES lpSecurityAttributes,
//     DWORD                 dwCreationDisposition,
//     DWORD                 dwFlagsAndAttributes,
//     HANDLE                hTemplateFile
//   );

function hookCreateFileW(moduleName) {
    hookFunction(moduleName, "CreateFileW", {
        onEnter: function (args) {

            log_message('[+] CreateFileW');
            log_message('  lpFileName: ' + ptr(args[0]).readUtf16String());
            log_message('  dwDesiredAccess: ' + args[1]);
            log_message('  dwShareMode: ' + args[2]);
            log_message('  lpSecurityAttributes: ' + args[3]);
            log_message('  dwCreationDisposition: ' + args[4]);
            log_message('  dwFlagsAndAttributes: ' + args[5]);
            log_message('  hTemplateFile: ' + args[6]);

            this.lpBuffer = args[1];
            this.lpNumberOfBytesRead = args[3]
        },
        onLeave: function (retval) {
            log_message('[+] CreateFileW returns: ' + retval);
        }
    })
}


// BOOL MoveFile(
//   LPCTSTR lpExistingFileName,
//   LPCTSTR lpNewFileName
// );


function hookMoveFile(moduleName) {
    hookFunction(moduleName, "MoveFile", {
        onEnter: function (args) {
            log_message('[+] MoveFile');
            log_message('  lpExistingFileName: ' + args[0]);
            log_message('  lpNewFileName: ' + args[1]);
        },
        onLeave: function (retval) {
            log_message('[+] returns: ' + retval);
        }
    })
}