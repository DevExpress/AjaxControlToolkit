REM Creates download package for .NET 4 version of Ajax Control Toolkit
REM Requires 7za.exe (http://www.7-zip.org/download.html) at c:\zip\7za.exe


SET PackageFolder=PackageForNET4
SET BinaryFolder=%PackageFolder%\AjaxControlToolkit.Binary.NET4
SET zipper=%c:\zip\7za.exe

REM Create the package folder
md %PackageFolder%
md %BinaryFolder%


REM Add all files from the Release folder
xcopy Server\AjaxControlToolkit\bin\Release\*.* %BinaryFolder% /E

REM Add the Readme and License files
copy License.txt %BinaryFolder%
copy ReadMe.html %BinaryFolder%

REM Add the Sample Site
%zipper% a %BinaryFolder%\AjaxControlToolkitSampleSite.zip .\SampleWebSites\AjaxControlToolkitSampleSite\*  

REM zip the results
%zipper% a %BinaryFolder%.zip .\%BinaryFolder%\* 