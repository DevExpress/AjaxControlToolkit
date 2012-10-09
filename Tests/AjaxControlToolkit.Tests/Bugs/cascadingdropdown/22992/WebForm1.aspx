<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.cascadingdropdown.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="sm1" runat="server"></act:ToolkitScriptManager>
    <div>
        <table>
            <tr>
                <td>Make</td>
                <td><asp:DropDownList ID="DropDownList1" runat="server" Width="170" /></td>
            </tr>
            <tr>
                <td>Model</td>
                <td><asp:DropDownList ID="DropDownList2" runat="server" Width="170" /></td>
            </tr>
            <%--<tr>
                <td>Color</td>
                <td><asp:DropDownList ID="DropDownList3" runat="server" Width="170" 
                     /></td>
            </tr>--%>
        </table>
        <br />
        
        <act:CascadingDropDown ID="CascadingDropDown1" runat="server" TargetControlID="DropDownList1"
            Category="Make"  PromptText="Please select a make"  LoadingText="[Loading makes...]"
            ServicePath="~/Bugs/cascadingdropdown/CarsService.asmx" ServiceMethod="GetDropDownContents" SelectedValue="GM(value)" />
        <act:CascadingDropDown ID="CascadingDropDown2" runat="server" TargetControlID="DropDownList2"
            Category="color" PromptText="Please select a model" LoadingText="[Loading models...]"
            ServiceMethod="GetDropDownContentsPageMethod" ParentControlID="DropDownList1" />
        <%--<act:CascadingDropDown ID="CascadingDropDown3" runat="server" TargetControlID="DropDownList3"
            Category="Color" PromptText="Please select a color" LoadingText="[Loading colors...]"
            ServicePath="~/Bugs/cascadingdropdown/CarsService.asmx" ServiceMethod="GetDropDownContents"
            ParentControlID="DropDownList2" />--%>
    </div>
    </form>
</body>
</html>
