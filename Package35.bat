REM Creates download package for .NET 3.5 version of Ajax Control Toolkit
REM Requires 7za.exe (http://www.7-zip.org/download.html) at c:\zip\7za.exe


SET PackageFolder=PackageForNET35
SET BinaryFolder=%PackageFolder%\AjaxControlToolkit.Binary.NET35
SET SanitizerProvidersFolder=%BinaryFolder%\SanitizerProviders
SET zipper=%c:\zip\7za.exe

REM Create the package folder
md %PackageFolder%
md %BinaryFolder%
md %SanitizerProvidersFolder%

REM Add all files from the Release folder
xcopy Server\AjaxControlToolkit\bin\Release\*.* %BinaryFolder% /E

REM Add the Readme and License files
copy License.txt %BinaryFolder%
copy ReadMe.html %BinaryFolder%

REM Add the Sanitizer Providers assemblies
copy Server\SanitizerProviders\bin\Release\SanitizerProviders.dll %SanitizerProvidersFolder%
copy Server\SanitizerProviders\bin\Release\AntiXSSLibrary.dll %SanitizerProvidersFolder%
copy Server\SanitizerProviders\bin\Release\HtmlSanitizationLibrary.dll %SanitizerProvidersFolder%

REM Copy the SanitizerProviders.dll to the Sample Site
copy Server\SanitizerProviders\bin\Release\SanitizerProviders.dll .\SampleWebSites\AjaxControlToolkitSampleSite\bin\ 

REM Add the Sample Site
%zipper% a %BinaryFolder%\AjaxControlToolkitSampleSite.zip .\SampleWebSites\AjaxControlToolkitSampleSite\*  


REM zip the results
%zipper% a %BinaryFolder%.zip .\%BinaryFolder%\* 