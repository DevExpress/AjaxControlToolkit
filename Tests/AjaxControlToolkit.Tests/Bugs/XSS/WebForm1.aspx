<%@ Page Language="C#" ClientIDMode="AutoID" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.XSS.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <act:ToolkitScriptManager runat="server" />
    
    
     
    <act:AsyncFileUpload runat="server" />
    
    

    <h1>Click Below:</h1>

    <a href="/MyApp/Bugs/XSS/WebForm1.aspx?_TSM_HiddenField_=ctl02_HiddenField37c5d%27)%3b}}alert(%27javascripthijacking%20and%20xss%27)//c9c4b0b8d4b&amp;_TSM_CombinedScripts_=%3b%3bAjaxControlToolkit%2c+Version%3d4.1.50508.0%2c+Culture%3dneutral%2c+PublicKeyToken%3d28f01b0e84b6d53e%3aen-US%3a1357eefc-6785-4cf2-ae20-9581f0a5f6cb%3ade1feab2%3af9cec9bc%3ae4bd8421">XSS</a>

    
    
    </div>
    </form>
</body>
</html>
