var readFileAddr = ptr(Module.findExportByName("kernel32.dll", "ReadFile"))
console.log('readFileAddr: ' + readFileAddr);

Interceptor.attach(readFileAddr, {
    onEnter: function (args) {
        // BOOL ReadFile(
        //  HANDLE       hFile,
        //  LPVOID       lpBuffer,
        //  DWORD        nNumberOfBytesToRead,
        //  LPDWORD      lpNumberOfBytesRead,
        //  LPOVERLAPPED lpOverlapped
        //);
        console.log('');
        console.log('[+] Called ReadFile');
        console.log('[+] hFile: ' + args[0]);
        console.log('[+] lpBuffer: ' + args[1]);
        console.log('[+] nNumberOfBytesToRead: ' + args[2]);
        console.log('[+] lpNumberOfBytesRead: ' + args[3]);
        console.log('[+] lpOverlapped: ' + args[4]);

        this.lpBuffer = args[1];
        this.lpNumberOfBytesRead = args[3]
    },

    onLeave: function (retval) {
        dumpAddr('Output', this.lpBuffer, 100);
        console.log('[+] Returned from CreateFileW: ' + retval);
    }
});

function dumpAddr(info, addr, size) {
    if (addr.isNull())
        return;
    console.log('Data dump ' + info + ' :');
    var buf = addr.readByteArray(size);

    console.log(hexdump(buf, { offset: 0, length: size, header: true, ansi: false }));
}
