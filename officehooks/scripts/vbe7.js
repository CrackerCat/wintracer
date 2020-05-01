function dumpAddress(address)
{
    console.log('[+] address: ' + address);

    if (address.isNull())
        return
    var data = ptr(address).readByteArray(50);
    console.log(hexdump(data, { offset: 0, length: 50, header: true, ansi: false }));
}

function dumpBSTR(address) {
    console.log('[+] address: ' + address);

    if (address.isNull())
        return

    var length = ptr(address-4).readULong(4);
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

var loadedModules = {}
var hookedFunctions = {}

function hookFunction(dllName, name) {
    dllName = dllName.split('.')[0]
    var functionName = dllName + "!" + name
    if (functionName in hookedFunctions) {
        return
    }
    
    console.log("hookFunction " + functionName);
    var addr = ptr(Module.findExportByName(dllName, name))
    if (!(dllName in loadedModules)) {
        console.log("DebugSymbol.loadModule " + functionName);
        DebugSymbol.loadModule(dllName)
        console.log("DebugSymbol.loadModule finished" + functionName);
        loadedModules[dllName] = 1
    }

    if (addr.isNull()) {
        console.log("DebugSymbol.getFunctionByName: " + functionName);
        addr = ptr(DebugSymbol.getFunctionByName(name));
        console.log("\t" + addr);
    }

    if (addr.isNull())
        return

    hookedFunctions[functionName] = 1
    console.log(functionName + ': ' + addr);

    Interceptor.attach(addr, {
        onEnter: function (args) {
            if (name == '__vbaStrCat') {
                // console.log('[+] ' + name);
                // dumpBSTR(args[0]);
                // dumpBSTR(args[1]);
            } else if (name == '__vbaStrComp') {
                console.log('[+] ' + name);
                console.log(ptr(args[1]).readUtf16String())
                console.log(ptr(args[2]).readUtf16String())
            } else if (name == 'rtcCreateObject2') {
                console.log('[+] ' + name);
                dumpAddress(args[0]);
                dumpBSTR(args[1]);
                console.log(ptr(args[2]).readUtf16String())
            } else if (name == 'rtcShell') {
                var variantArg = ptr(args[0])
                dumpAddress(variantArg);
                var bstrPtr = ptr(variantArg.add(8).readULong())
                dumpBSTR(bstrPtr);
            } else if (name == 'DispCallFunc') {
                console.log('[+] ' + name);
                var pvInstance = args[0]
                var oVft = args[1]
                var instance = ptr(ptr(pvInstance).readULong());

                console.log(' instance:' + instance);
                console.log(' oVft:' + oVft);
                var vftbPtr = instance.add(oVft)
                console.log(' vftbPtr:' + vftbPtr);
                var functionAddress = ptr(ptr(vftbPtr).readULong())

                var modules = Process.enumerateModules()

                var i
                for(i = 0; i < modules.length; i++) {
                    if ( functionAddress >=  modules[i].base &&  functionAddress <= modules[i].base.add(modules[i].size)) {
                        console.log(" " + modules[i].name + ": " + modules[i].base + " " + modules[i].size + " " + modules[i].path)

                        var modName = modules[i].path
                        if (!(modName in loadedModules)) {                            
                            console.log("  DebugSymbol.loadModule " + modName);
                            var loadedModuleBase = DebugSymbol.loadModule(modName)
                            console.log("  DebugSymbol.loadModule loadedModuleBase: " + loadedModuleBase);                            
                            loadedModules[modName] = 1
                        }
                        break
                    }
                }

                console.log(' functionAddress:' + functionAddress);
                var functionName = DebugSymbol.fromAddress(functionAddress)

                if (functionName) {
                    console.log(' functionName:' + functionName);
                }

                dumpAddress(functionAddress);
                
                var currentAddress = functionAddress
                for(var i = 0; i < 10; i++) {
                    var instruction = Instruction.parse(currentAddress)
                    console.log(instruction.address + ': ' + instruction.mnemonic + ' ' + instruction.opStr)
                    currentAddress = instruction.next
                }
            } else {
                console.log('[+] ' + name);
            }
        },

        onLeave: function (retval) {
            if (name == '__vbaStrCat')
            {
                dumpBSTR(retval);
            }else if (name == 'rtcCreateObject2')
            {
                console.log('[+] ' + name);
                dumpAddress(retval);
            }
        }
    });
}

function hookFunctionLoop(value, index, array) {
    hookFunction(value);
}

function hookLoadLibrary(dllName, name) {
    var function_name = dllName + "!" + name

    var addr = ptr(Module.findExportByName(dllName, name));
    if (addr.isNull())
        return

    console.log(function_name + ': ' + addr);
    Interceptor.attach(addr, {
        onEnter: function (args) {
            // console.log('[+] ' + function_name);
            this.target_dllName = "";

            if (function_name == "KERNELBASE!LoadLibraryA")
            {
                this.target_dllName = ptr(args[0]).readCString()
            }else if (function_name == "KERNELBASE!LoadLibraryW")
            {
                this.target_dllName = ptr(args[0]).readUtf16String()
            }else if (function_name == "KERNELBASE!LoadLibraryExA")
            {
                this.target_dllName = ptr(args[0]).readCString()
            }else if (function_name == "KERNELBASE!LoadLibraryExW")
            {
                this.target_dllName = ptr(args[0]).readUtf16String()
            }else if (function_name == "KERNEL32!LoadLibraryA")
            {
                this.target_dllName = ptr(args[0]).readCString()
            }else if (function_name == "KERNEL32!LoadLibraryW")
            {
                this.target_dllName = ptr(args[0]).readUtf16String()
            }
        },
        onLeave: function (retval) {
            if (this.target_dllName) {
                if (this.target_dllName == 'VBE7.DLL')
                {
                    var i;
                    for (i = 0; i < rtcFunctions.length; i++) {
                        hookFunction (this.target_dllName, rtcFunctions[i]);
                    }
                }else if (this.target_dllName == 'OLEAUT32.DLL') {
                    var i;
                    for (i = 0; i < oleAutFunctions.length; i++) {
                        hookFunction (this.target_dllName, oleAutFunctions[i]);
                    }                
                }
            }
        }
    });
}

var rtcFunctions = ["rtcBstrFromByte", "rtcChangeDrive", "rtcSetDateVar", "rtcUpperCaseVar", "rtcGetErl", "rtcBstrFromFormatVar", "rtcRightCharBstr", "rtcBstrFromChar", "rtcMakeDir", "rtcSwitch", "rtcFreeFile", "rtcGetCurrentCalendar", "rtcRightVar", "rtcStrConvVar2", "rtcInStrRev", "rtcStrConvVar", "rtcSendKeys", "rtcPackDate", "rtcGetAllSettings", "rtcGetYear", "rtcRate", "rtcAtn", "rtcBeep", "rtcPV", "rtcFV", "rtcRgb", "rtcOctBstrFromVar", "rtcTrimVar", "rtcVarBstrFromAnsi", "rtcAppActivate", "rtcMidVar", "rtcLenCharVar", "rtcIntVar", "rtcR8ValFromBstr", "rtcReplace", "rtcAnsiValueBstr", "rtcShell", "rtcIsError", "rtcCreateObject2", "rtcGetTimer", "rtcStringVar", "rtcMsgBox", "rtcChoose", "rtcUpperCaseBstr", "rtcDateDiff", "rtcGetDateVar", "rtcSqr", "rtcVarDateFromVar", "rtcGetDateBstr", "rtcSetDateBstr", "rtcCurrentDirBstr", "rtcChangeDir", "rtcFileDateTime", "rtcInputCount", "rtcHexBstrFromVar", "rtcEndOfFile", "rtcLeftBstr", "rtcFixVar", "rtcVarFromFormatVar", "rtcDDB", "rtcFileLength", "rtcInputCharCountVar", "rtcFormatNumber", "rtcBstrFromError", "rtcSetCurrentCalendar", "rtcIsEmpty", "rtcMonthName", "rtcIsNumeric", "rtcTrimBstr", "rtcPPMT", "rtcStrReverse", "rtcNPer", "rtcIPMT", "rtcStringBstr", "rtcVarBstrFromByte", "rtcArray", "rtcPartition", "rtcKillFiles", "rtcFileLen", "rtcFileLocation", "rtcNPV", "rtcTan", "rtcLeftCharBstr", "rtcGetMonthOfYear", "rtcIRR", "rtcIMEStatus", "rtcCreateObject", "rtcCVErrFromVar", "rtcMidCharBstr", "rtcIsMissing", "rtcVarType", "rtcLog", "rtcSpaceBstr", "rtcByteValueBstr", "rtcEnvironBstr", "rtcImmediateIf", "rtcRemoveDir", "rtcFileSeek", "rtcRightCharVar", "rtcFormatCurrency", "rtcPackTime", "rtcGetHourOfDay", "rtcFileAttributes", "rtcGetDateValue", "rtcRightTrimVar", "rtcSgnVar", "rtcStrFromVar", "rtcVarStrFromVar", "rtcGetSetting", "rtcVarBstrFromChar", "rtcSetTimeVar", "rtcHexVarFromVar", "rtcFormatDateTime", "rtcDoEvents", "rtcPMT", "rtcSaveSetting", "rtcIsObject", "rtcRightBstr", "rtcAppleScript", "rtcRandomNext", "rtcWeekdayName", "rtcErrObj", "rtcCos", "rtcGetPresentDate", "rtcLeftTrimVar", "rtcLenVar", "rtcMidCharVar", "rtcDeleteSetting", "rtcFormatPercent", "rtcLowerCaseBstr", "rtcSplit", "rtcDateAdd", "rtcInStr", "rtcBstrFromAnsi", "rtcGetDayOfWeek", "rtcCharValueBstr", "rtcSYD", "rtcGetHostLCID", "rtcIsDate", "rtcSetDatabaseLcid", "rtcRound", "rtcCurrentDir", "rtcVarFromVar", "rtcMIRR", "rtcEnvironVar", "rtcIsArray", "rtcDateFromVar", "rtcFileClose", "rtcDir", "rtcVarFromError", "rtcSpaceVar", "rtcRightTrimBstr", "rtcLeftVar", "rtcRandomize", "rtcGetMinuteOfHour", "rtcExp", "rtcGetTimeVar", "rtcCompareBstr", "rtcGetSecondOfMinute", "rtcGetTimeBstr", "rtcGetFileAttr", "rtcSetTimeBstr", "rtcSetFileAttr", "rtcOctVarFromVar", "rtcSLN", "rtcFileCopy", "rtcInputCharCount", "rtcCommandVar", "rtcCommandBstr", "rtcInputCountVar", "rtcGetObject", "rtcDatePart", "rtcLowerCaseVar", "rtcInputBox", "rtcLeftCharVar", "rtcSin", "rtcCallByName", "rtcLeftTrimBstr", "rtcQBColor", "rtcMacId", "rtcFileWidth", "rtcJoin", "rtcAbsVar"];
var rtcFunctions2 = ["rtcFilter", "rtcBstrFromByte", "rtcFileReset", "rtcGetTimeValue", "rtcIsNull", "rtcMidBstr", "rtcGetDayOfMonth", "rtcTypeName", "rtcInStrChar", "rtcChangeDrive", "rtcSetDateVar", "rtcUpperCaseVar", "rtcGetErl", "rtcBstrFromFormatVar", "rtcRightCharBstr", "rtcBstrFromChar", "rtcMakeDir", "rtcSwitch", "rtcFreeFile", "rtcGetCurrentCalendar", "rtcRightVar", "rtcStrConvVar2", "rtcInStrRev", "rtcStrConvVar", "rtcSendKeys", "rtcPackDate", "rtcGetAllSettings", "rtcGetYear", "rtcRate", "rtcAtn", "rtcBeep", "rtcPV", "rtcFV", "rtcRgb", "rtcOctBstrFromVar", "rtcTrimVar", "rtcVarBstrFromAnsi", "rtcAppActivate", "rtcMidVar", "rtcLenCharVar", "rtcIntVar", "rtcR8ValFromBstr", "rtcReplace", "rtcAnsiValueBstr", "rtcShell", "rtcIsError", "rtcCreateObject2", "rtcGetTimer", "rtcStringVar", "rtcMsgBox", "rtcChoose", "rtcUpperCaseBstr", "rtcDateDiff", "rtcGetDateVar", "rtcSqr", "rtcVarDateFromVar", "rtcGetDateBstr", "rtcSetDateBstr", "rtcCurrentDirBstr", "rtcChangeDir", "rtcFileDateTime", "rtcInputCount", "rtcHexBstrFromVar", "rtcEndOfFile", "rtcLeftBstr", "rtcFixVar", "rtcVarFromFormatVar", "rtcDDB", "rtcFileLength", "rtcInputCharCountVar", "rtcFormatNumber", "rtcBstrFromError", "rtcSetCurrentCalendar", "rtcIsEmpty", "rtcMonthName", "rtcIsNumeric", "rtcTrimBstr", "rtcPPMT", "rtcStrReverse", "rtcNPer", "rtcIPMT", "rtcStringBstr", "rtcVarBstrFromByte", "rtcArray", "rtcPartition", "rtcKillFiles", "rtcFileLen", "rtcFileLocation", "rtcNPV", "rtcTan", "rtcLeftCharBstr", "rtcGetMonthOfYear", "rtcIRR", "rtcIMEStatus", "rtcCreateObject", "rtcCVErrFromVar", "rtcMidCharBstr", "rtcIsMissing", "rtcVarType", "rtcLog", "rtcSpaceBstr", "rtcByteValueBstr", "rtcEnvironBstr", "rtcImmediateIf", "rtcRemoveDir", "rtcFileSeek", "rtcRightCharVar", "rtcFormatCurrency", "rtcPackTime", "rtcGetHourOfDay", "rtcFileAttributes", "rtcGetDateValue", "rtcRightTrimVar", "rtcSgnVar", "rtcStrFromVar", "rtcVarStrFromVar", "rtcGetSetting", "rtcVarBstrFromChar", "rtcSetTimeVar", "rtcHexVarFromVar", "rtcFormatDateTime", "rtcDoEvents", "rtcPMT", "rtcSaveSetting", "rtcIsObject", "rtcRightBstr", "rtcAppleScript", "rtcRandomNext", "rtcWeekdayName", "rtcErrObj", "rtcCos", "rtcGetPresentDate", "rtcLeftTrimVar", "rtcLenVar", "rtcMidCharVar", "rtcDeleteSetting", "rtcFormatPercent", "rtcLowerCaseBstr", "rtcSplit", "rtcDateAdd", "rtcInStr", "rtcBstrFromAnsi", "rtcGetDayOfWeek", "rtcCharValueBstr", "rtcSYD", "rtcGetHostLCID", "rtcIsDate", "rtcSetDatabaseLcid", "rtcRound", "rtcCurrentDir", "rtcVarFromVar", "rtcMIRR", "rtcEnvironVar", "rtcIsArray", "rtcDateFromVar", "rtcFileClose", "rtcDir", "rtcVarFromError", "rtcSpaceVar", "rtcRightTrimBstr", "rtcLeftVar", "rtcRandomize", "rtcGetMinuteOfHour", "rtcExp", "rtcGetTimeVar", "rtcCompareBstr", "rtcGetSecondOfMinute", "rtcGetTimeBstr", "rtcGetFileAttr", "rtcSetTimeBstr", "rtcSetFileAttr", "rtcOctVarFromVar", "rtcSLN", "rtcFileCopy", "rtcInputCharCount", "rtcCommandVar", "rtcCommandBstr", "rtcInputCountVar", "rtcGetObject", "rtcDatePart", "rtcLowerCaseVar", "rtcInputBox", "rtcLeftCharVar", "rtcSin", "rtcCallByName", "rtcLeftTrimBstr", "rtcQBColor", "rtcMacId", "rtcFileWidth", "rtcJoin", "rtcAbsVar"];
var vbaStrFunctions = ["__vbaStrCy", "__vbaStrDate", "__vbaStrI4", "__vbaStrI2", "__vbaStrCompVar", "__vbaStr2Vec", "__vbaStrR8", "__vbaStrR4", "__vbaStrToUnicode", "__vbaStrAryToAnsi", "__vbaStrBool", "__vbaStrVarCopy", "__vbaStrComp", "__vbaStrAryToUnicode", "__vbaStrCat", "__vbaStrToAnsi"]
var oleAutFunctions = ["DispCallFunc"]

hookLoadLibrary("KERNELBASE", "LoadLibraryA");
hookLoadLibrary("KERNELBASE", "LoadLibraryW");
hookLoadLibrary("KERNELBASE", "LoadLibraryExA");
hookLoadLibrary("KERNELBASE", "LoadLibraryExW");

hookLoadLibrary("KERNEL32", "LoadLibraryA");
hookLoadLibrary("KERNEL32", "LoadLibraryW");

var i;
for (i = 0; i < rtcFunctions.length; i++) {
    hookFunction ("VBE7.DLL", rtcFunctions[i]);
}
var j;
for (j = 0; j < oleAutFunctions.length; j++) {
    hookFunction ("OLEAUT32", oleAutFunctions[j]);
} 