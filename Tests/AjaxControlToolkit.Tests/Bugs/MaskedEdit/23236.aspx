<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="23236.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Issue23236" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" />
    <div>
        <asp:TextBox ID="txtDate" runat="server"></asp:TextBox>
        <act:calendarextender id="dtpDate" runat="server" format="dd/MM/yyyy" targetcontrolid="txtDate" />
        <act:maskededitextender id="mskDate" runat="server" targetcontrolid="txtDate"
            masktype="Date" mask="99/99/9999" culturename="en-GB" culturedateformat="DMY" UserDateFormat="DayMonthYear"
            oninvalidcssclass="field_error" />
        <act:maskededitvalidator id="mevDate" runat="server" controlextender="mskDate"
            controltovalidate="txtDate" invalidvaluemessage="Date is invalid. Format is dd/mm/yyyy."
            validationgroup="CaptureFields" />
        dd/mm/yyyy
        <br />
    </div>
    </form>
</body>
</html>
