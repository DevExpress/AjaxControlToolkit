<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Tabs._23482.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </act:ToolkitScriptManager>
    <div>
        <asp:UpdatePanel ID="upMain" runat="server">
            <ContentTemplate>
                <act:TabContainer runat="server" ID="tcTabs" Height="200" ActiveTabIndex="0" Width="720"
                    AutoPostBack="false">
                    <act:TabPanel runat="server" ID="tpGeneralFields" HeaderText="&lt;span class='tabPanelSmall' title='General Fields'&gt;General Fields&lt;/span&gt;"
                        ToolTip="General Fields">
                        <ContentTemplate>
                            <table border="0" width="720" cellspacing="0" cellpadding="0">
                                <tr>
                                    <th align="left">
                                        Type Of Service:
                                    </th>
                                    <td>
                                        <asp:DropDownList ID="cbxTypeOfService" runat="server" />
                                    </td>
                                    <th align="left">
                                        Rule Number:
                                    </th>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        Rule Version:
                                    </th>
                                    <td>
                                    </td>
                                    <th align="left">
                                        Rule Priority:
                                    </th>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left" title="Effective date between date start and date end">
                                        Effective Date Range:
                                    </th>
                                    <td>
                                    </td>
                                    <th align="center">
                                        -- and --
                                    </th>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left" title="End date between date start and date end">
                                        End Date Range:
                                    </th>
                                    <td>
                                    </td>
                                    <th align="center">
                                        -- and --
                                    </th>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left" title="End date between date start and date end">
                                        Age Range:
                                    </th>
                                    <td>
                                    </td>
                                    <th align="center">
                                        -- and --
                                    </th>
                                    <td>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        Use for Fee For Service?:
                                    </th>
                                    <td colspan="3">
                                        <asp:DropDownList ID="cbxUseForFeeForService" runat="server" DataTextField="TextField"
                                            DataValueField="ValueField">
                                            <asp:ListItem Selected="True" Value="NA">Not Selected</asp:ListItem>
                                            <asp:ListItem Value="N">No</asp:ListItem>
                                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        Use for Encounters?:
                                    </th>
                                    <td colspan="3">
                                        <asp:DropDownList ID="cbxUseForEncounters" runat="server" DataTextField="TextField"
                                            DataValueField="ValueField">
                                            <asp:ListItem Selected="True" Value="NA">Not Selected</asp:ListItem>
                                            <asp:ListItem Value="N">No</asp:ListItem>
                                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        Use For Gross Adjustments?:
                                    </th>
                                    <td colspan="3">
                                        <asp:DropDownList ID="cbxUseForGrossAdjustments" runat="server" DataTextField="TextField"
                                            DataValueField="ValueField">
                                            <asp:ListItem Selected="True" Value="NA">Not Selected</asp:ListItem>
                                            <asp:ListItem Value="N">No</asp:ListItem>
                                            <asp:ListItem Value="Y">Yes</asp:ListItem>
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        MSIS File:
                                    </th>
                                    <td colspan="3">
                                        <asp:DropDownList ID="cbxMSISFile" runat="server" DataTextField="TextField" DataValueField="ValueField">
                                            <asp:ListItem Selected="True" Value="NA">Not Selected</asp:ListItem>
                                            <asp:ListItem Value="ClaimIP">ClaimIP</asp:ListItem>
                                            <asp:ListItem Value="ClaimLT">ClaimLT</asp:ListItem>
                                            <asp:ListItem Value="ClaimOT">ClaimOT</asp:ListItem>
                                            <asp:ListItem Value="ClaimRX">ClaimRX</asp:ListItem>
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                            </table>
                        </ContentTemplate>
                    </act:TabPanel>
                    <act:TabPanel runat="server" ID="tpCodeFields" HeaderText="&lt;span class='tabPanelSmall' title='Code Fields'&gt;Code Fields&lt;/span&gt;"
                        ToolTip="Code Fields">
                        <ContentTemplate>
                            <table border="0" width="720" cellspacing="0" cellpadding="0">
                                <tr>
                                    <th align="left">
                                        Diagnosis Code:
                                    </th>
                                    <td>
                                        <asp:TextBox ID="txDiagnosisCode" runat="server" MaxLength="5" Columns="5" />
                                    </td>
                                    <th align="left">
                                        MCO Program:
                                    </th>
                                    <td>
                                        <asp:TextBox ID="txMCOProgram" runat="server" MaxLength="4" Columns="4" />
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        Low Procedure Code:
                                    </th>
                                    <td>
                                        <asp:TextBox ID="txLowProcedureCode" runat="server" MaxLength="6" Columns="6" />
                                    </td>
                                    <th align="left">
                                        High Procedure Code:
                                    </th>
                                    <td>
                                        <asp:TextBox ID="txHighProcedureCode" runat="server" MaxLength="6" Columns="6" />
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        Provider Type:
                                    </th>
                                    <td>
                                        <asp:TextBox ID="txProviderType" runat="server" MaxLength="4" Columns="4" />
                                    </td>
                                    <th align="left">
                                        Provider Type Specialty:
                                    </th>
                                    <td>
                                        <asp:TextBox ID="txProviderTypeSpecialty" runat="server" MaxLength="4" Columns="4" />
                                    </td>
                                </tr>
                                <tr>
                                    <th align="left">
                                        Provider Type Sub Specialty:
                                    </th>
                                    <td colspan="3">
                                        <asp:TextBox ID="txProviderTypeSubSpecialty" runat="server" MaxLength="4" Columns="4" />
                                    </td>
                                </tr>
                            </table>
                        </ContentTemplate>
                    </act:TabPanel>
                </act:TabContainer>
                <table border="0" width="720" cellspacing="0" cellpadding="0">
                    <tr>
                        <td colspan="4" align="center">
                            <br />
                            <asp:Button ID="btSearch" runat="server" Text="Search" />
                            <asp:Button ID="btCancel" runat="server" Text="Cancel" />
                            <asp:Button ID="btClear" runat="server" Text="Clear" />
                        </td>
                    </tr>
                </table>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    </form>
</body>
</html>
