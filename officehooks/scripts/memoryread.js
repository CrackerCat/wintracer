function dumpAddress(address)
{
    console.log('[+] address: ' + address);

    if (address.isNull())
        return
    var data = ptr(address).readByteArray(50);
    console.log(hexdump(data, { offset: 0, length: 50, header: true, ansi: false }));
}

function dumpBytes(address, length) {
    if (address.isNull())
        return
    var data = ptr(address).readByteArray(length);
    console.log(hexdump(data, { offset: 0, length: length, header: true, ansi: false }));
}

function dumpSymbols(address, count) {
    if (address.isNull())
        return

    var currentAddress = address
    for(var i = 0; i < count; i++) {
        var readAddress = ptr(currentAddress).readPointer();
        readAddress = ptr(readAddress)
        var symbolInformation = DebugSymbol.fromAddress(readAddress)

        if (symbolInformation && symbolInformation.name) {
            console.log(currentAddress + ":\t" + readAddress + " " + symbolInformation.name)
        }else {
            console.log(currentAddress + ":\t" + readAddress)
        }
        currentAddress = currentAddress.add(4)
    }
}

function dumpBSTR(address) {
    console.log('[+] address: ' + address);

    if (address.isNull())
        return

    var length = ptr(address-4).readULong(4);
    console.log("length: " + length)
    var data = ptr(address).readByteArray(length);
    console.log(hexdump(data, { offset: 0, length: length, header: true, ansi: false }));
}

function getString(address)
{
    if (address.isNull())
        return

    var dataString = ''

    var offset = 0
    var stringEnded = false    
    while (!stringEnded)
    {
        var data = new Uint8Array(ptr(address.add(offset)).readByteArray(10));

        if (data.length <= 0)
        {
            break
        }

        var i;
        for (i = 0; i < data.length; i++) {
            if (data[i] == 0x0)
            {
                stringEnded = true
                break
            }
            dataString += String.fromCharCode(data[i])
        }
        offset += data.length
    }

    console.log("dataString: " + dataString)
    return dataString;
}

function dumpWSTR(address)
{
    if (address.isNull())
        return

    var dataString = ''

    var offset = 0
    var stringEnded = false    
    while (!stringEnded)
    {
        var data = new Uint8Array(ptr(address.add(offset)).readByteArray(20));

        if (data.length <= 0)
        {
            break
        }

        var i;
        for (i = 0; i < data.length; i+=2 ) {
            if (data[i] == 0x0 && data[i+1] == 0x0)
            {
                stringEnded = true
                break
            }
            dataString += String.fromCharCode(data[i])
        }
        offset += data.length
    }

    console.log("dataString: " + dataString)
    return dataString;
}
