
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
            log_message("[+] CreateProcessA")
            log_message(" " + ptr(args[0]).readCString())
            log_message(" " + ptr(args[1]).readCString())
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
            log_message("[+] CreateProcessW")
            if (args[0] != 0 ) {
                log_message('  lpApplicationName: ' + ptr(args[0]).readUtf16String())
            }

            if (args[1] != 0 ) { 
                log_message('  lpCommandLine: ' + ptr(args[1]).readUtf16String())
            }
            log_message('  lpProcessAttributes: ' + args[2]);
            log_message('  lpThreadAttributes: ' + args[3]);
            log_message('  bInheritHandles: ' + args[4]);
            log_message('  dwCreationFlags: ' + args[5]);
            // var espPtr = ptr(this.context['esp'])
            // var dwCreationFlagsPtr = espPtr.add(0x4*6)
            // log_message('   dwCreationFlagsPtr.readU32(): ' + dwCreationFlagsPtr.readU32())
            // dwCreationFlagsPtr.writeU32(0x4)

            log_message('  lpEnvironment: ' + args[6]);
            log_message('  lpCurrentDirectory: ' + args[7]);
            log_message('  lpStartupInfo: ' + args[8]);
            log_message('  lpProcessInformation: ' + args[9]);
            this.lpProcessInformation = ptr(args[9])
        },
        onLeave: function (retval) {
            // typedef struct _PROCESS_INFORMATION {
            //   HANDLE hProcess;
            //   HANDLE hThread;
            //   DWORD  dwProcessId;
            //   DWORD  dwThreadId;
            // } PROCESS_INFORMATION, *PPROCESS_INFORMATION, *LPPROCESS_INFORMATION;
            
            log_message('  this.lpProcessInformation: ' + this.lpProcessInformation)

            var hThread = this.lpProcessInformation.add(4).readPointer()
            var processId = this.lpProcessInformation.add(8).readU32()
            log_message('   hThread: ' + hThread)
            log_message('   processId: ' + processId)

            /*send(processId.toString());
            var op = recv('input', function(value) {
                log_message('   ResumeThread: ' + hThread)
                resumeThread(hThread)                
            });

            log_message('op.wait()')
            op.wait();*/
        }
    })
}


// DWORD ResumeThread(
//   HANDLE hThread
// );

const resumeThread = new NativeFunction(Module.getExportByName("kernel32", 'ResumeThread'), 'uint32', ['pointer']);
