<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Animation_TestPage.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Animation.Animation_TestPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    

        <act:ToolkitScriptManager ID="ScriptManager1" runat="Server" />
        <div>
        <asp:Panel Id="Panel1" runat="server">
            <h1>Animate Me!</h1>
        </asp:Panel>
         <act:AnimationExtender ID="extender" TargetControlID="Panel1" runat="server">
              <Animations>
                <OnLoad><StyleAction Attribute="backgroundColor" Value="red" /></OnLoad>
                <OnClick><StyleAction Attribute="backgroundColor" Value="blue" /></OnClick>
                <OnMouseOver><StyleAction Attribute="backgroundColor" Value="orange" /></OnMouseOver>
                <OnMouseOut><StyleAction Attribute="backgroundColor" Value="green" /></OnMouseOut>
                <OnHoverOver><StyleAction Attribute="color" Value="purple" /></OnHoverOver>
                <OnHoverOut><StyleAction Attribute="color" Value="yellow" /></OnHoverOut>
        </Animations>            
        </act:AnimationExtender>
        </div>


    </div>
    </form>
</body>
</html>
