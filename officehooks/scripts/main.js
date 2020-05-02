function loadDLLHooks(dllName) {
    if (dllName in hookMap) {

        try {
            if (Module.getBaseAddress(dllName).isNull()) {
                return
            }
        }
        catch(err)
        {
            return
        }

        // console.log("loadDLLHooks dllName: " + dllName)
        var calls = hookMap[dllName]
        for(var i = 0 ; i < calls.length; i++) {
            // console.log("  calls[" + i + "]: " + calls[i])
            calls[i](dllName)
        }
    }
}

function hookLoadLibraryA(moduleName) {
    hookFunction(moduleName, "LoadLibraryA", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readCString()
            console.log("[+] LoadLibraryA: " + this.targetDLLName)
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

function hookLoadLibraryExA(moduleName) {
    hookFunction(moduleName, "LoadLibraryExA", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readCString()
            console.log("[+] LoadLibraryExA: " + this.targetDLLName)
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

function hookLoadLibraryW(moduleName) {
    hookFunction(moduleName, "LoadLibraryW", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readUtf16String()
            console.log("[+] LoadLibraryW: " + this.targetDLLName)            
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

function hookLoadLibraryExW(moduleName) {
    hookFunction(moduleName, "LoadLibraryExW", {
        onEnter: function (args) {
            this.targetDLLName = ptr(args[0]).readUtf16String()
            console.log("[+] LoadLibraryExW: " + this.targetDLLName)            
        },
        onLeave: function (retval) {
            loadDLLHooks(this.targetDLLName)               
        }
    })
}

// var rtcFunctions = ["rtcBstrFromByte", "rtcChangeDrive", "rtcSetDateVar", "rtcUpperCaseVar", "rtcGetErl", "rtcBstrFromFormatVar", "rtcRightCharBstr", "rtcBstrFromChar", "rtcMakeDir", "rtcSwitch", "rtcFreeFile", "rtcGetCurrentCalendar", "rtcRightVar", "rtcStrConvVar2", "rtcInStrRev", "rtcStrConvVar", "rtcSendKeys", "rtcPackDate", "rtcGetAllSettings", "rtcGetYear", "rtcRate", "rtcAtn", "rtcBeep", "rtcPV", "rtcFV", "rtcRgb", "rtcOctBstrFromVar", "rtcTrimVar", "rtcVarBstrFromAnsi", "rtcAppActivate", "rtcMidVar", "rtcLenCharVar", "rtcIntVar", "rtcR8ValFromBstr", "rtcReplace", "rtcAnsiValueBstr", "rtcIsError", "rtcCreateObject2", "rtcGetTimer", "rtcStringVar", "rtcMsgBox", "rtcChoose", "rtcUpperCaseBstr", "rtcDateDiff", "rtcGetDateVar", "rtcSqr", "rtcVarDateFromVar", "rtcGetDateBstr", "rtcSetDateBstr", "rtcCurrentDirBstr", "rtcChangeDir", "rtcFileDateTime", "rtcInputCount", "rtcHexBstrFromVar", "rtcEndOfFile", "rtcLeftBstr", "rtcFixVar", "rtcVarFromFormatVar", "rtcDDB", "rtcFileLength", "rtcInputCharCountVar", "rtcFormatNumber", "rtcBstrFromError", "rtcSetCurrentCalendar", "rtcIsEmpty", "rtcMonthName", "rtcIsNumeric", "rtcTrimBstr", "rtcPPMT", "rtcStrReverse", "rtcNPer", "rtcIPMT", "rtcStringBstr", "rtcVarBstrFromByte", "rtcArray", "rtcPartition", "rtcKillFiles", "rtcFileLen", "rtcFileLocation", "rtcNPV", "rtcTan", "rtcLeftCharBstr", "rtcGetMonthOfYear", "rtcIRR", "rtcIMEStatus", "rtcCreateObject", "rtcCVErrFromVar", "rtcMidCharBstr", "rtcIsMissing", "rtcVarType", "rtcLog", "rtcSpaceBstr", "rtcByteValueBstr", "rtcEnvironBstr", "rtcImmediateIf", "rtcRemoveDir", "rtcFileSeek", "rtcRightCharVar", "rtcFormatCurrency", "rtcPackTime", "rtcGetHourOfDay", "rtcFileAttributes", "rtcGetDateValue", "rtcRightTrimVar", "rtcSgnVar", "rtcStrFromVar", "rtcVarStrFromVar", "rtcGetSetting", "rtcVarBstrFromChar", "rtcSetTimeVar", "rtcHexVarFromVar", "rtcFormatDateTime", "rtcDoEvents", "rtcPMT", "rtcSaveSetting", "rtcIsObject", "rtcRightBstr", "rtcAppleScript", "rtcRandomNext", "rtcWeekdayName", "rtcErrObj", "rtcCos", "rtcGetPresentDate", "rtcLeftTrimVar", "rtcLenVar", "rtcMidCharVar", "rtcDeleteSetting", "rtcFormatPercent", "rtcLowerCaseBstr", "rtcSplit", "rtcDateAdd", "rtcInStr", "rtcBstrFromAnsi", "rtcGetDayOfWeek", "rtcCharValueBstr", "rtcSYD", "rtcGetHostLCID", "rtcIsDate", "rtcSetDatabaseLcid", "rtcRound", "rtcCurrentDir", "rtcVarFromVar", "rtcMIRR", "rtcEnvironVar", "rtcIsArray", "rtcDateFromVar", "rtcFileClose", "rtcDir", "rtcVarFromError", "rtcSpaceVar", "rtcRightTrimBstr", "rtcLeftVar", "rtcRandomize", "rtcGetMinuteOfHour", "rtcExp", "rtcGetTimeVar", "rtcCompareBstr", "rtcGetSecondOfMinute", "rtcGetTimeBstr", "rtcGetFileAttr", "rtcSetTimeBstr", "rtcSetFileAttr", "rtcOctVarFromVar", "rtcSLN", "rtcFileCopy", "rtcInputCharCount", "rtcCommandVar", "rtcCommandBstr", "rtcInputCountVar", "rtcGetObject", "rtcDatePart", "rtcLowerCaseVar", "rtcInputBox", "rtcLeftCharVar", "rtcSin", "rtcCallByName", "rtcLeftTrimBstr", "rtcQBColor", "rtcMacId", "rtcFileWidth", "rtcJoin", "rtcAbsVar"];
// var rtcFunctions2 = ["rtcFilter", "rtcBstrFromByte", "rtcFileReset", "rtcGetTimeValue", "rtcIsNull", "rtcMidBstr", "rtcGetDayOfMonth", "rtcTypeName", "rtcInStrChar", "rtcChangeDrive", "rtcSetDateVar", "rtcUpperCaseVar", "rtcGetErl", "rtcBstrFromFormatVar", "rtcRightCharBstr", "rtcBstrFromChar", "rtcMakeDir", "rtcSwitch", "rtcFreeFile", "rtcGetCurrentCalendar", "rtcRightVar", "rtcStrConvVar2", "rtcInStrRev", "rtcStrConvVar", "rtcSendKeys", "rtcPackDate", "rtcGetAllSettings", "rtcGetYear", "rtcRate", "rtcAtn", "rtcBeep", "rtcPV", "rtcFV", "rtcRgb", "rtcOctBstrFromVar", "rtcTrimVar", "rtcVarBstrFromAnsi", "rtcAppActivate", "rtcMidVar", "rtcLenCharVar", "rtcIntVar", "rtcR8ValFromBstr", "rtcReplace", "rtcAnsiValueBstr", "rtcShell", "rtcIsError", "rtcCreateObject2", "rtcGetTimer", "rtcStringVar", "rtcMsgBox", "rtcChoose", "rtcUpperCaseBstr", "rtcDateDiff", "rtcGetDateVar", "rtcSqr", "rtcVarDateFromVar", "rtcGetDateBstr", "rtcSetDateBstr", "rtcCurrentDirBstr", "rtcChangeDir", "rtcFileDateTime", "rtcInputCount", "rtcHexBstrFromVar", "rtcEndOfFile", "rtcLeftBstr", "rtcFixVar", "rtcVarFromFormatVar", "rtcDDB", "rtcFileLength", "rtcInputCharCountVar", "rtcFormatNumber", "rtcBstrFromError", "rtcSetCurrentCalendar", "rtcIsEmpty", "rtcMonthName", "rtcIsNumeric", "rtcTrimBstr", "rtcPPMT", "rtcStrReverse", "rtcNPer", "rtcIPMT", "rtcStringBstr", "rtcVarBstrFromByte", "rtcArray", "rtcPartition", "rtcKillFiles", "rtcFileLen", "rtcFileLocation", "rtcNPV", "rtcTan", "rtcLeftCharBstr", "rtcGetMonthOfYear", "rtcIRR", "rtcIMEStatus", "rtcCreateObject", "rtcCVErrFromVar", "rtcMidCharBstr", "rtcIsMissing", "rtcVarType", "rtcLog", "rtcSpaceBstr", "rtcByteValueBstr", "rtcEnvironBstr", "rtcImmediateIf", "rtcRemoveDir", "rtcFileSeek", "rtcRightCharVar", "rtcFormatCurrency", "rtcPackTime", "rtcGetHourOfDay", "rtcFileAttributes", "rtcGetDateValue", "rtcRightTrimVar", "rtcSgnVar", "rtcStrFromVar", "rtcVarStrFromVar", "rtcGetSetting", "rtcVarBstrFromChar", "rtcSetTimeVar", "rtcHexVarFromVar", "rtcFormatDateTime", "rtcDoEvents", "rtcPMT", "rtcSaveSetting", "rtcIsObject", "rtcRightBstr", "rtcAppleScript", "rtcRandomNext", "rtcWeekdayName", "rtcErrObj", "rtcCos", "rtcGetPresentDate", "rtcLeftTrimVar", "rtcLenVar", "rtcMidCharVar", "rtcDeleteSetting", "rtcFormatPercent", "rtcLowerCaseBstr", "rtcSplit", "rtcDateAdd", "rtcInStr", "rtcBstrFromAnsi", "rtcGetDayOfWeek", "rtcCharValueBstr", "rtcSYD", "rtcGetHostLCID", "rtcIsDate", "rtcSetDatabaseLcid", "rtcRound", "rtcCurrentDir", "rtcVarFromVar", "rtcMIRR", "rtcEnvironVar", "rtcIsArray", "rtcDateFromVar", "rtcFileClose", "rtcDir", "rtcVarFromError", "rtcSpaceVar", "rtcRightTrimBstr", "rtcLeftVar", "rtcRandomize", "rtcGetMinuteOfHour", "rtcExp", "rtcGetTimeVar", "rtcCompareBstr", "rtcGetSecondOfMinute", "rtcGetTimeBstr", "rtcGetFileAttr", "rtcSetTimeBstr", "rtcSetFileAttr", "rtcOctVarFromVar", "rtcSLN", "rtcFileCopy", "rtcInputCharCount", "rtcCommandVar", "rtcCommandBstr", "rtcInputCountVar", "rtcGetObject", "rtcDatePart", "rtcLowerCaseVar", "rtcInputBox", "rtcLeftCharVar", "rtcSin", "rtcCallByName", "rtcLeftTrimBstr", "rtcQBColor", "rtcMacId", "rtcFileWidth", "rtcJoin", "rtcAbsVar"];
// var vbaStrFunctions = ["__vbaStrCy", "__vbaStrDate", "__vbaStrI4", "__vbaStrI2", "__vbaStrCompVar", "__vbaStr2Vec", "__vbaStrR8", "__vbaStrR4", "__vbaStrToUnicode", "__vbaStrAryToAnsi", "__vbaStrBool", "__vbaStrVarCopy", "__vbaStrComp", "__vbaStrAryToUnicode", "__vbaStrCat", "__vbaStrToAnsi"]

var hookMap = {
    'VBE7.DLL': [hookRtcShell, hookRtcCreateObject2, hookVBAStrCat, hookVBAStrComp],
    'OLEAUT32.DLL': [hookDispCall],
    'kernel32.dll': [hookLoadLibraryA, hookLoadLibraryExA, hookLoadLibraryW, hookLoadLibraryExW, 
                    hookVirtualAlloc, hookCreateFileW, ], // hookReadFile
    'kernelbase.dll': [hookLoadLibraryA, hookLoadLibraryExA, hookLoadLibraryW, hookLoadLibraryExW, 
                    hookVirtualAlloc, hookCreateFileW, ] // hookReadFile
}

for(var dllName in hookMap) {
    console.log("dllName: " + dllName)
    loadDLLHooks(dllName)
}
