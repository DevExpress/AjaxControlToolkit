New-Item AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Images -type directory
New-Item AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Styles -type directory
New-Item AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Debug -type directory
New-Item AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Release -type directory

Copy-Item -Path AjaxControlToolkit.StaticResources\Images\* -Destination AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Images -Recurse 
Copy-Item -Path AjaxControlToolkit.StaticResources\Styles\* -Destination AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Styles -Recurse 
Copy-Item -Path AjaxControlToolkit.StaticResources\Scripts\Debug\* -Destination AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Debug -Recurse 
Copy-Item -Path AjaxControlToolkit.StaticResources\Scripts\Release\* -Destination AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Release -Recurse 

$archiveSuffix = "preview"

Push-Location -Path "AjaxControlToolkit.StaticResources"
7z a ..\AjaxControlToolkit.StaticResources-$archiveSuffix-$env:APPVEYOR_BUILD_NUMBER.zip Content\AjaxControlToolkit\Images -ir!Content\AjaxControlToolkit\Styles\* -ir!Scripts\AjaxControlToolkit\Debug\* -ir!Scripts\AjaxControlToolkit\Release\* ..\bin\Release\AjaxControlToolkit.StaticResources.???
Pop-Location

Push-Location -Path "bin\Release"
7z a ..\..\AjaxControlToolkit-$archiveSuffix-$env:APPVEYOR_BUILD_NUMBER.zip AjaxControlToolkit.??? 
7z a ..\..\AjaxControlToolkit.HtmlEditor.Sanitizer-$archiveSuffix-$env:APPVEYOR_BUILD_NUMBER.zip AjaxControlToolkit.HtmlEditor.Sanitizer.???
Pop-Location

$sampleSiteFolder = "AjaxControlToolkit.SampleSite\"
Copy-Item "bin\Release\AjaxControlToolkit.dll" -Destination "$sampleSiteFolder\bin"
Copy-Item "bin\Release\AjaxControlToolkit.HtmlEditor.Sanitizer.dll" -Destination "$sampleSiteFolder\bin"
Copy-Item AppVeyor\SampleSite.sln -Destination $sampleSiteFolder
nuget restore "$sampleSiteFolder\packages.config" -SolutionDirectory $sampleSiteFolder
$sampleSiteBinFolder = Join-Path $sampleSiteFolder "bin"
Get-ChildItem $sampleSiteBinFolder -Filter *.refresh | `
ForEach-Object {
	$content = Get-Content $_.FullName
	$dllFileName = $content -replace "^\.\.\\", ""
	Copy-Item "$sampleSiteFolder/$dllFileName" $sampleSiteBinFolder -Force
}

Remove-Item "$sampleSiteFolder\bin\*" -Exclude *.dll
Remove-Item "$sampleSiteFolder\packages" -Recurse -Force
Remove-Item "$sampleSiteFolder\packages.config"

7z a AjaxControlToolkit.SampleSite-$archiveSuffix-$env:APPVEYOR_BUILD_NUMBER.zip $sampleSiteFolder