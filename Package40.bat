REM Creates download package for .NET 4.0 version of Ajax Control Toolkit
REM Requires 7za.exe (http://www.7-zip.org/download.html) at c:\zip\7za.exe

SET MSBuildFolder=C:\Windows\Microsoft.NET\Framework\v4.0.30319\

SET PackageFolderNET40=PackageForNET40

SET BinaryFolderNET40=%PackageFolderNET40%\AjaxControlToolkit.Binary.NET40

SET SampleSiteFolder=.\SampleWebSites\AjaxControlToolkitSampleSite

SET zipper=%c:\zip\7za.exe

REM Remove package folders
rd %PackageFolderNET40% /s /q

REM Clean up old binaries
rd Client\MicrosoftAjax\bin /s /q
rd Client\MicrosoftAjax.Extended\bin /s /q
rd Server\AjaxControlToolkit\bin\NET40 /s /q

REM Prepare web.config
copy /Y %SampleSiteFolder%\Web.config %SampleSiteFolder%\Web_config_backup.exclude 
copy /Y %SampleSiteFolder%\Web.NET40.config.exclude %SampleSiteFolder%\Web.config  

REM Build the Solution
%MSBuildFolder%msbuild AjaxControlToolkit.sln /p:Configuration=Release;TargetFrameworkVersion=v4.0;ToolsVersion=4.0;ChildBuild=False /t:build

REM Create the package folders
md %PackageFolderNET40%

REM Create the binary folders
md %BinaryFolderNET40%

REM Add all files from the Release folder
xcopy Server\AjaxControlToolkit\bin\NET40\Release\*.* %BinaryFolderNET40% /E

REM Add the Readme and License files
copy License.txt %BinaryFolderNET40%
copy ReadMe.html %BinaryFolderNET40%

REM Add the Sample Site
md SampleSite40
xcopy %SampleSiteFolder%\*.* SampleSite40 /E /Y
xcopy %BinaryFolderNET40%\*.* SampleSite40\Bin /E /Y
del SampleSite40\*.exclude
c:\zip\7za.exe a %BinaryFolderNET40%\AjaxControlToolkitSampleSite.zip .\SampleSite40\*  
rd SampleSite40 /s /q
copy /Y %SampleSiteFolder%\Web_config_backup.exclude %SampleSiteFolder%\Web.config
del %SampleSiteFolder%\Web_config_backup.exclude

REM zip the results
c:\zip\7za.exe a %BinaryFolderNET40%.zip .\%BinaryFolderNET40%\* 
