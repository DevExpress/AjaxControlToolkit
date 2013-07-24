REM Creates download package for .NET 3.5 version of Ajax Control Toolkit
REM Requires 7za.exe (http://www.7-zip.org/download.html) at c:\zip\7za.exe

SET MSBuildFolder=C:\Windows\Microsoft.NET\Framework\v4.0.30319\

SET PackageFolderNET35=PackageForNET35

SET BinaryFolderNET35=%PackageFolderNET35%\AjaxControlToolkit.Binary.NET35

SET SampleSiteFolder=.\SampleWebSites\AjaxControlToolkitSampleSite

SET zipper=%c:\zip\7za.exe

REM Remove package folders
rd %PackageFolderNET35% /s /q

REM Clean up old binaries
rd Client\MicrosoftAjax\bin /s /q
rd Client\MicrosoftAjax.Extended\bin /s /q
rd Server\AjaxControlToolkit\bin\NET35 /s /q

REM Prepare web.config
copy /Y %SampleSiteFolder%\Web.config %SampleSiteFolder%\Web_config_backup.exclude 
copy /Y %SampleSiteFolder%\Web.NET35.config.exclude %SampleSiteFolder%\Web.config  

REM Build the Solution
%MSBuildFolder%msbuild AjaxControlToolkit.sln /p:Configuration=Release;TargetFrameworkVersion=v3.5;ToolsVersion=3.5;ChildBuild=False /t:build

REM Create the package folders
md %PackageFolderNET35%

REM Create the binary folders
md %BinaryFolderNET35%

REM Add all files from the Release folder
xcopy Server\AjaxControlToolkit\bin\NET35\Release\*.* %BinaryFolderNET35% /E

REM Add the Readme and License files
copy License.txt %BinaryFolderNET35%
copy ReadMe.html %BinaryFolderNET35%

REM Add the Sample Site
md SampleSite35
xcopy %SampleSiteFolder%\*.* SampleSite35 /E /Y
xcopy %BinaryFolderNET35%\*.* SampleSite35\Bin /E /Y
del SampleSite35\Bin\Microsoft.WindowsAzure.Storage.*
del SampleSite35\*.exclude
c:\zip\7za.exe a %BinaryFolderNET35%\AjaxControlToolkitSampleSite.zip .\SampleSite35\*  
rd SampleSite35 /s /q
copy /Y %SampleSiteFolder%\Web_config_backup.exclude %SampleSiteFolder%\Web.config
del %SampleSiteFolder%\Web_config_backup.exclude

REM zip the results
c:\zip\7za.exe a %BinaryFolderNET35%.zip .\%BinaryFolderNET35%\* 
