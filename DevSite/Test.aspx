<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ToolkitScriptManager runat="server" />
    
        <div style="position: relative;">
            <asp:TextBox runat="server" ID="TB1" /><br/>
            <asp:CalendarExtender runat="server" TargetControlID="TB1" />
            <asp:DropDownList runat="server" ID="DDL1"></asp:DropDownList>
        </div>
        
        <hr />
        
        <div style="position: relative; text-align: center;">
            <asp:TextBox runat="server" ID="TB2" /><br/>
            <asp:CalendarExtender runat="server" TargetControlID="TB2" />
            <asp:DropDownList runat="server" ID="DDL2"></asp:DropDownList>
        </div>     
    
    </div>
    </form>
</body>
</html>
