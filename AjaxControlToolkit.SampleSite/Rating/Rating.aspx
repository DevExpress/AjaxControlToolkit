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
            <p>
                The Rating control provides an intuitive rating experience that allows users to select the number
                of stars that represents their rating.  The page designer can specify the initial rating, the
                maximum rating to allow, the alignment and direction of the stars, and custom styles for the
                different states a star can have.  Rating also supports a ClientCallBack event that allows custom
                code to run after the user has rated something.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Rating Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:Rating ID="ThaiRating" runat="server"
    <em>CurrentRating</em>="2"
    <em>MaxRating</em>="5"
    <em>StarCssClass</em>="ratingStar"
    <em>WaitingStarCssClass</em>="savedRatingStar"
    <em>FilledStarCssClass</em>="filledRatingStar"
    <em>EmptyStarCssClass</em>="emptyRatingStar"
    <em>OnChanged</em>="ThaiRating_Changed" /&gt;
            </pre>
            <ul>
                <li><strong>AutoPostBack</strong> - True to cause a postback on rating item click.</li>
                <li><strong>CurrentRating</strong> - Initial rating value</li>
                <li><strong>MaxRating</strong> - Maximum rating value</li>
                <li><strong>ReadOnly</strong> - Whether or not the rating can be changed</li>
                <li><strong>StarCssClass</strong> - CSS class for a visible star</li>
                <li><strong>WaitingStarCssClass</strong> - CSS class for a star in waiting mode</li>
                <li><strong>FilledStarCssClass</strong> - CSS class for star in filled mode</li>
                <li><strong>EmptyStarCssClass</strong> - CSS class for a star in empty mode</li>
                <li><strong>RatingAlign</strong> - Alignment of the stars (Vertical or Horizontal)</li>
                <li><strong>RatingDirection</strong> - Orientation of the stars (LeftToRightTopToBottom or RightToLeftBottomToTop)</li>
                <li><strong>OnChanged</strong> - ClientCallBack event to fire when the rating is changed</li>
                <li><strong>Tag</strong> - A custom parameter to pass to the ClientCallBack</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
