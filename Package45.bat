REM Creates download package .NET 4.5 version of Ajax Control Toolkit
REM Requires 7za.exe (http://www.7-zip.org/download.html) at c:\zip\7za.exe

SET MSBuildFolder=C:\Windows\Microsoft.NET\Framework\v4.0.30319\

SET PackageFolderNET45=PackageForNET45

SET BinaryFolderNET45=%PackageFolderNET45%\AjaxControlToolkit.Binary.NET45

SET SampleSiteFolder=.\SampleWebSites\AjaxControlToolkitSampleSite

SET zipper=%c:\zip\7za.exe

REM Remove package folders
rd %PackageFolderNET45% /s /q

REM Clean up old binaries
rd Client\MicrosoftAjax\bin /s /q
rd Client\MicrosoftAjax.Extended\bin /s /q
rd Server\AjaxControlToolkit\bin\NET45 /s /q

REM Prepare web.config
copy /Y %SampleSiteFolder%\Web.config %SampleSiteFolder%\Web_config_backup.exclude 
copy /Y %SampleSiteFolder%\Web.NET45.config.exclude %SampleSiteFolder%\Web.config  

REM Build the Solution
%MSBuildFolder%msbuild AjaxControlToolkit.sln /p:Configuration=Release;TargetFrameworkVersion=v4.5;ToolsVersion=4.0;ChildBuild=False /t:build

REM Create the package folders
md %PackageFolderNET45%

REM Create the binary folders
md %BinaryFolderNET45%

REM Add all files from the Release folder
xcopy Server\AjaxControlToolkit\bin\NET45\Release\*.* %BinaryFolderNET45% /E

REM Add the Readme and License files
copy License.txt %BinaryFolderNET45%
copy ReadMe.html %BinaryFolderNET45%

REM Add the Sample Site
md SampleSite45
xcopy %SampleSiteFolder%\*.* SampleSite45 /E /Y
xcopy %BinaryFolderNET45%\*.* SampleSite45\Bin /E /Y
del SampleSite45\*.exclude
c:\zip\7za.exe a %BinaryFolderNET45%\AjaxControlToolkitSampleSite.zip .\SampleSite45\*  
rd SampleSite45 /s /q
copy /Y %SampleSiteFolder%\Web_config_backup.exclude %SampleSiteFolder%\Web.config
del %SampleSiteFolder%\Web_config_backup.exclude

REM zip the results
c:\zip\7za.exe a %BinaryFolderNET45%.zip .\%BinaryFolderNET45%\* 
