& "C:\Program Files\IIS\Microsoft Web Deploy V3\msdeploy.exe" -verb:sync -source:iisApp="$env:APPVEYOR_BUILD_FOLDER\AjaxControlToolkit.Jasmine" -dest:iisApp=`"Default Web Site`"

$FilesAndFolders = gci "C:\inetpub\wwwroot" -recurse | % {$_.FullName}
foreach($FileAndFolder in $FilesAndFolders)
{
    $item = gi -literalpath $FileAndFolder 
    $acl = $item.GetAccessControl() 
    $permission = "Everyone","FullControl","Allow"
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
    $acl.SetAccessRule($rule)
    $item.SetAccessControl($acl)
}