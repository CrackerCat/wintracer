var hookMap = {
    'VBE7.DLL': [hookRtcShell, hookRtcCreateObject2, hookVBAStrCat, hookVBAStrComp],
    'OLEAUT32.DLL': [hookDispCall],
    'kernel32.dll': [hookLoadLibraryA, hookLoadLibraryExA, hookLoadLibraryW, hookLoadLibraryExW, hookCreateFileW, hookReadFile
                    ], // hookReadFile hookVirtualAlloc, hookCreateFileW, 
    'kernelbase.dll': [hookLoadLibraryA, hookLoadLibraryExA, hookLoadLibraryW, hookLoadLibraryExW, hookCreateFileW, hookReadFile
                     ] // hookReadFile hookVirtualAlloc, hookCreateFileW,
}

for(var dllName in hookMap) {
    console.log("dllName: " + dllName)
    loadDLLHooks(dllName)
}
