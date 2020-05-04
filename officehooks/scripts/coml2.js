
// .text:100143E0 ; int __stdcall CExposedStream::Read(CExposedStream *this, void *, unsigned int, unsigned int *)

function hookCExposedStreamRead(moduleName) {
    hookFunction(moduleName, "CExposedStream::Read", {
        onEnter: function (args) {
            console.log("[+] CExposedStream::Read")
            console.log(" this: " + args[0])
            console.log(" buffer: " + args[1])
            this.buffer = ptr(args[1])
            console.log(" length: " + args[2])
            console.log(" pLength: " + args[3])
            this.pLength = ptr(args[3])

            console.log('CExposedStream::Read called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');                    
        },
        onLeave: function (retval) {
            dumpBytes(ptr(this.buffer), this.pLength.readULong())
        }
    })
}

// CExposedStream::AddRef
// CExposedStream::CExposedStream
// CExposedStream::Clone
// CExposedStream::Close
// CExposedStream::Commit
// CExposedStream::CopyTo
// CExposedStream::CopyToWorker
// CExposedStream::Flush
// CExposedStream::GetMarshalSizeMax
// CExposedStream::GetSize
// CExposedStream::GetUnmarshalClass
// CExposedStream::Init
// CExposedStream::IsModified
// CExposedStream::Lock
// CExposedStream::Map
// CExposedStream::MarshalInterface
// CExposedStream::Open
// CExposedStream::QueryInterface
// CExposedStream::ReOpen
// CExposedStream::Read
// CExposedStream::Release
// CExposedStream::ReleaseMarshalData
// CExposedStream::Revert
// CExposedStream::Seek
// CExposedStream::SetModified
// CExposedStream::SetSize
// CExposedStream::SetSize
// CExposedStream::Stat
// CExposedStream::Unlock
// CExposedStream::Unmap
// CExposedStream::Unmarshal
// CExposedStream::Validate
// CExposedStream::ValidateWriteAccess
// CExposedStream::Write
// CExposedStream::~CExposedStream

function hookCExposedStreamMethods(moduleName) {
    var funcNames = ["CExposedStream::AddRef", "CExposedStream::CExposedStream", "CExposedStream::Clone", "CExposedStream::Close", "CExposedStream::Commit", "CExposedStream::CopyTo", "CExposedStream::CopyToWorker", "CExposedStream::Flush", "CExposedStream::GetMarshalSizeMax", "CExposedStream::GetSize", "CExposedStream::GetUnmarshalClass", "CExposedStream::Init", "CExposedStream::IsModified", "CExposedStream::Lock", "CExposedStream::Map", "CExposedStream::MarshalInterface", "CExposedStream::Open", "CExposedStream::QueryInterface", "CExposedStream::ReOpen", "CExposedStream::Read", "CExposedStream::Release", "CExposedStream::ReleaseMarshalData", "CExposedStream::Revert", "CExposedStream::Seek", "CExposedStream::SetModified", "CExposedStream::SetSize", "CExposedStream::SetSize", "CExposedStream::Stat", "CExposedStream::Unlock", "CExposedStream::Unmap", "CExposedStream::Unmarshal", "CExposedStream::Validate", "CExposedStream::ValidateWriteAccess", "CExposedStream::Write", "CExposedStream::~CExposedStream"]

    hookFunctionNames(moduleName, funcNames)
}

function hookComl2Functions(moduleName) {
    hookFunctionNames(moduleName, com2lFuncNames)
}