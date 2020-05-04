
function BytesToCLSID(address) {
    if (address.isNull())
        return

    var data = new Uint8Array(ptr(address).readByteArray(0x10))
    var clsid = "{" + getHexString(data[3]) + getHexString(data[2]) + getHexString(data[1]) + getHexString(data[0]) 
    clsid += '-' + getHexString(data[5]) + getHexString(data[4])
    clsid += '-' + getHexString(data[7]) + getHexString(data[6])
    clsid += '-' + getHexString(data[8]) + getHexString(data[9])
    clsid += '-' + getHexString(data[10]) + getHexString(data[11]) + getHexString(data[12]) + getHexString(data[13]) + getHexString(data[14]) + getHexString(data[15])
    clsid += '}'

    return clsid
}
