// Bytes:
//  62 f2 ca ca 
//  70 93 
//  15 46 
//  a1 3b 
//  9f 55 39 da 4c 0a
// CLSID: cacaf262-9370-4615-a13b-9f5539da4c0a

function getHexString(value) {
    return ('00' + value.toString(16).toUpperCase()).slice(-2)
}

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

// HRESULT CoCreateInstanceEx(
//   REFCLSID     Clsid,
//   IUnknown     *punkOuter,
//   DWORD        dwClsCtx,
//   COSERVERINFO *pServerInfo,
//   DWORD        dwCount,
//   MULTI_QI     *pResults
// );

function hookCoCreateInstanceEx(moduleName) {
    hookFunction(moduleName, "CoCreateInstanceEx", {
        onEnter: function (args) {
            console.log("[+] CoCreateInstanceEx")
            var clsid = BytesToCLSID(args[0])
            console.log(" Clsid: " + clsid)
            console.log(" punkOuter: " + args[1])
            console.log(" dwClsCtx: " + args[2])
            console.log(" pServerInfo: " + args[3])
            console.log(" dwCount: " + args[4])
            console.log(" pResults: " + args[5])            
        }
    })
}

// HRESULT CoCreateInstance(
//   REFCLSID  rclsid,
//   LPUNKNOWN pUnkOuter,
//   DWORD     dwClsContext,
//   REFIID    riid,
//   LPVOID    *ppv
// );

function hookCoCreateInstance(moduleName) {
    hookFunction(moduleName, "CoCreateInstance", {
        onEnter: function (args) {
            console.log("[+] CoCreateInstance")
            var clsid = BytesToCLSID(args[0])
            console.log(" Clsid: " + clsid)
            this.clsid = clsid
            if (clsid in clsidNameMap) {
                console.log("  " + clsidNameMap[clsid])
            }
            console.log(" punkOuter: " + args[1])
            console.log(" dwClsContext: " + args[2])
            console.log(" riid: " + args[3])
            console.log(" ppv: " + args[4])
            this.ppv = args[4]
        },
        onLeave: function (retval) {
            if (this.clsid == "{0002CE02-0000-0000-C000-000000000046}") {
                console.log('===========================================')
                var ppvPointer = ptr(this.ppv).readPointer()
                dumpSymbols(ppvPointer, 5)

                console.log('===========================================')
                var currentAddress = ppvPointer
                for(var i = 0; i < 4; i++) {
                    var ppvPointerPointer = ptr(currentAddress).readPointer()
                    // hookPointers(ppvPointerPointer, 200)                    
                    currentAddress = currentAddress.add(4)
                }
            }
        }
    })
}

// HRESULT __stdcall CDefObject::InitFromData(CDefObject *this, IDataObject *pDataObject, int fCreation, unsigned int dwReserved)

function hookCDefObjectInitFromData(moduleName) {
    hookFunction(moduleName, "CDefObject::InitFromData", {
        onEnter: function (args) {
            console.log("[+] CDefObject::InitFromData")
            console.log(" this: " + args[0])
            console.log(" pDataObject: " + args[1])
            dumpBytes(ptr(args[1]), 0x100)
            console.log(" fCreation: " + args[2])
            console.log(" dwReserved: " + args[3])
        }
    })
}

// HRESULT __stdcall CDefObject::Load(CDefObject *this, IStorage *pstg)

function hookCDefObjectLoad(moduleName) {
    hookFunction(moduleName, "CDefObject::Load", {
        onEnter: function (args) {
            console.log("[+] CDefObject::Load")
            console.log(" this: " + args[0])
            console.log(" pstg: " + args[1])
            dumpBytes(ptr(args[1]), 0x500)
        }
    })
}

// HRESULT __stdcall CDefObject::Run(CDefObject *this, IBindCtx *pbc)

function hookCDefObjectRun(moduleName) {
    hookFunction(moduleName, "CDefObject::Run", {
        onEnter: function (args) {
            console.log("[+] CDefObject::Run")
            console.log(" this: " + args[0])
            console.log(" pbc: " + args[1])
            dumpBytes(ptr(args[1]), 0x500)
        }
    })
}

// HRESULT __stdcall ReadOleStg(
//  IStorage *pstg,
//  unsigned int *pdwFlags,
//  unsigned int *pdwOptUpdate,
//  unsigned int *pdwReserved,
//  IMoniker **ppmk,
//  IStream **ppstmOut)

function hookReadOleStg(moduleName) {
    hookFunction(moduleName, "ReadOleStg", {
        onEnter: function (args) {
            console.log("[+] ReadOleStg")
            console.log(" pstg: " + args[0])
            console.log(" pdwFlags: " + args[1])
            console.log(" pdwOptUpdate: " + args[2])
            console.log(" pdwReserved: " + args[3])
            console.log(" ppmk: " + args[4])
            console.log(" ppstmOut: " + args[5])
        }
    })
}

// HRESULT __fastcall StRead(IStream *pStm, void *pvBuffer, unsigned int ulcb)

// .text:7584596A loc_7584596A:           ; pStm
// .text:7584596A mov     ecx, [ebp+pstm]
// .text:7584596D lea     edx, [ebp+dwBuf] ; pvBuffer
// .text:75845970 push    10h             ; ulcb
// .text:75845972 call    ?StRead@@YGJPAUIStream@@PAXK@Z ; StRead(IStream *,void *,

function hookStRead(moduleName) {
    hookFunction(moduleName, "StRead", {
        onEnter: function (args) {
            console.log("[+] StRead")           
            var pStm = this.context['ecx']
            this.pvBuffer = this.context['edx']
            this.ulcb = args[0]
            console.log(" pStm: " + pStm)
            console.log(" pvBuffer: " + this.pvBuffer)
            console.log(" ulcb: " + this.ulcb)
        },
        onLeave: function (retval) {
            // dumpBytes(ptr(this.pvBuffer), 0x500)
            dumpBytes(ptr(ptr(this.pvBuffer).readPointer()), 0x500)
        }
    })
}

// "CDefObject::`scalar",
// "CDefObject::~CDefObject",
// "CDefObject::AddConnection",
// "CDefObject::AddRef",
// "CDefObject::Advise",
// "CDefObject::CAdvSinkImpl::OnClose",
// "CDefObject::CAdvSinkImpl::OnDataChange",
// "CDefObject::CAdvSinkImpl::OnRename",
// "CDefObject::CAdvSinkImpl::OnSave",
// "CDefObject::CAdvSinkImpl::Release",
// "CDefObject::CDefObject",
// "CDefObject::CleanupFn",
// "CDefObject::Close",
// "CDefObject::CPrivUnknown::QueryInterface",
// "CDefObject::CPrivUnknown::Release",
// "CDefObject::Create",
// "CDefObject::CreateDelegate",
// "CDefObject::DAdvise",
// "CDefObject::DoConversionIfSpecialClass",
// "CDefObject::DoVerb",
// "CDefObject::DUnadvise",
// "CDefObject::EnumAdvise",
// "CDefObject::EnumDAdvise",
// "CDefObject::EnumFormatEtc",
// "CDefObject::EnumVerbs",
// "CDefObject::GetCanonicalFormatEtc",
// "CDefObject::GetClassBits",
// "CDefObject::GetClassID",
// "CDefObject::GetClientSite",
// "CDefObject::GetClipboardData",
// "CDefObject::GetData",
// "CDefObject::GetDataDelegate",
// "CDefObject::GetDataHere",
// "CDefObject::GetExtent",
// "CDefObject::GetMiscStatus",
// "CDefObject::GetMoniker",
// "CDefObject::GetOleDelegate",
// "CDefObject::GetPSDelegate",
// "CDefObject::GetRunningClass",
// "CDefObject::GetUserClassID",
// "CDefObject::GetUserType",
// "CDefObject::HandsOffStorage",
// "CDefObject::InitNew",
// "CDefObject::IsDirty",
// "CDefObject::IsRunning",
// "CDefObject::IsUpToDate",
// "CDefObject::LockRunning",
// "CDefObject::QueryGetData",
// "CDefObject::QueryInterface",
// "CDefObject::Release",
// "CDefObject::ReleaseConnection",
// "CDefObject::Save",
// "CDefObject::SaveCompleted",
// "CDefObject::SetClientSite",
// "CDefObject::SetColorScheme",
// "CDefObject::SetContainedObject",
// "CDefObject::SetExtent",
// "CDefObject::SetHostNames",
// "CDefObject::SetMoniker",
// "CDefObject::Stop",
// "CDefObject::Unadvise",
// "CDefObject::Update",

function hookOLE32Funcs(moduleName) {
    var funcNames = ["CDefObject::SetData", "CDefObject::Run", "CDefObject::`scalar", "CDefObject::~CDefObject", "CDefObject::AddConnection", "CDefObject::AddRef", "CDefObject::Advise", "CDefObject::CAdvSinkImpl::OnClose", "CDefObject::CAdvSinkImpl::OnDataChange", "CDefObject::CAdvSinkImpl::OnRename", "CDefObject::CAdvSinkImpl::OnSave", "CDefObject::CAdvSinkImpl::Release", "CDefObject::CDefObject", "CDefObject::CleanupFn", "CDefObject::Close", "CDefObject::CPrivUnknown::QueryInterface", "CDefObject::CPrivUnknown::Release", "CDefObject::Create", "CDefObject::CreateDelegate", "CDefObject::DAdvise", "CDefObject::DoConversionIfSpecialClass", "CDefObject::DoVerb", "CDefObject::DUnadvise", "CDefObject::EnumAdvise", "CDefObject::EnumDAdvise", "CDefObject::EnumFormatEtc", "CDefObject::EnumVerbs", "CDefObject::GetCanonicalFormatEtc", "CDefObject::GetClassBits", "CDefObject::GetClassID", "CDefObject::GetClientSite", "CDefObject::GetClipboardData", "CDefObject::GetData", "CDefObject::GetDataDelegate", "CDefObject::GetDataHere", "CDefObject::GetExtent", "CDefObject::GetMiscStatus", "CDefObject::GetMoniker", "CDefObject::GetOleDelegate", "CDefObject::GetPSDelegate", "CDefObject::GetRunningClass", "CDefObject::GetUserClassID", "CDefObject::GetUserType", "CDefObject::HandsOffStorage", "CDefObject::InitNew", "CDefObject::IsDirty", "CDefObject::IsRunning", "CDefObject::IsUpToDate", "CDefObject::LockRunning", "CDefObject::QueryGetData", "CDefObject::QueryInterface", "CDefObject::Release", "CDefObject::ReleaseConnection", "CDefObject::Save", "CDefObject::SaveCompleted", "CDefObject::SetClientSite", "CDefObject::SetColorScheme", "CDefObject::SetContainedObject", "CDefObject::SetExtent", "CDefObject::SetHostNames", "CDefObject::SetMoniker", "CDefObject::Stop", "CDefObject::Unadvise", "CDefObject::Update"]
    hookFunctionNames(moduleName, funcNames)
}
