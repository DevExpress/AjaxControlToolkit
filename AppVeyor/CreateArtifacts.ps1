New-Item AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Images -type directory
New-Item AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Styles -type directory
New-Item AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Debug -type directory
New-Item AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Release -type directory

Copy-Item -Path AjaxControlToolkit.StaticResources\Images\* -Destination AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Images -Recurse 
Copy-Item -Path AjaxControlToolkit.StaticResources\Styles\* -Destination AjaxControlToolkit.StaticResources\Content\AjaxControlToolkit\Styles -Recurse 
Copy-Item -Path AjaxControlToolkit.StaticResources\Scripts\Debug\* -Destination AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Debug -Recurse 
Copy-Item -Path AjaxControlToolkit.StaticResources\Scripts\Release\* -Destination AjaxControlToolkit.StaticResources\Scripts\AjaxControlToolkit\Release -Recurse 

Push-Location -Path "AjaxControlToolkit.StaticResources"
7z a ..\AjaxControlToolkit.StaticResources-nightly-$env:APPVEYOR_BUILD_NUMBER.zip Content\AjaxControlToolkit\Images -ir!Content\AjaxControlToolkit\Styles\* -ir!Scripts\AjaxControlToolkit\Debug\* -ir!Scripts\AjaxControlToolkit\Release\* ..\bin\Release\AjaxControlToolkit.StaticResources.???
Pop-Location

Push-Location -Path "AjaxControlToolkit.HtmlEditor.Sanitizer"
7z a ..\AjaxControlToolkit.HtmlEditor.Sanitizer-nightly-$env:APPVEYOR_BUILD_NUMBER.zip AjaxControlToolkit.HtmlEditor.Sanitizer.???
Pop-Location

Push-Location -Path "bin\Release"
7z a ..\..\AjaxControlToolkit-nightly-$env:APPVEYOR_BUILD_NUMBER.zip AjaxControlToolkit.??? 
Pop-Location

7z a AjaxControlToolkit.SampleSite-nightly-$env:APPVEYOR_BUILD_NUMBER.zip AjaxControlToolkit.SampleSite\