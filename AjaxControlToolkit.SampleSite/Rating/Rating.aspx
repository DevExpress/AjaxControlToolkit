<%@ Page Title="Rating Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="Rating.aspx.cs" Inherits="Rating_Rating" %>

<asp:Content ContentPlaceHolderID="DemoHeading" Runat="Server">
    Rating Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" Runat="Server">
    <asp:UpdatePanel runat="server" ID="up1">
            <ContentTemplate>
                <div style="float: left;">How spicy do you like your Thai food? &nbsp;</div>
                <ajaxToolkit:Rating ID="ThaiRating" runat="server" BehaviorID="RatingBehavior1"
                    CurrentRating="2"
                    MaxRating="5"
                    StarCssClass="ratingStar"
                    WaitingStarCssClass="savedRatingStar"
                    FilledStarCssClass="filledRatingStar"
                    EmptyStarCssClass="emptyRatingStar"
                    OnChanged="ThaiRating_Changed"
                    style="float: left;" />
                   
                <div style="clear:left;">
                    <table>
                        <tr>
                            <td>Alignment:</td>
                            <td>
                                <asp:DropDownList ID="lstAlign" runat="server" AutoPostBack="true">
                                    <asp:ListItem Selected="true" Text="Horizontal" />
                                    <asp:ListItem Text="Vertical" />
                                </asp:DropDownList>
                            </td>
                        </tr>
                        <tr>
                            <td>Direction:</td>
                            <td>
                                <asp:DropDownList ID="lstDirection" runat="server" AutoPostBack="true">
                                    <asp:ListItem Selected="True" Text="Left to Right or Top to Bottom" />
                                    <asp:ListItem Text="Right to Left or Bottom to Top" />
                                </asp:DropDownList>
                            </td>
                        </tr>
                    </table>
                    <br />
                    
                    <asp:Button ID="btnSubmit" runat="server" Text="Submit" OnClick="Submit_Click" /><br /><br />
                    <asp:Label ID="lblResponse" runat="server" Text="[No response provided yet]"></asp:Label>
                </div>
            </ContentTemplate>
        </asp:UpdatePanel>
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" Runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>Rating Description</Header>
        <Content>
            <div runat="server" data-control-type="Rating" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Rating Properties</Header>
        <Content>
            <div runat="server" data-control-type="Rating" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
