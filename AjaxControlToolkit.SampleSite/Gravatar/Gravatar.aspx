<%@ Page Title="Gravatar" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="Gravatar.aspx.cs" Inherits="Gravatar_Gravatar" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    Gravatar Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    Displays gravatar for an email account:
    <br />
    <ajaxToolkit:Gravatar ID="Gravatar1" Email="test@devexpress.com" Size="200" Rating="R" runat="server" />
    <br />
    <hr />
    Displays default image for an email which doesn't meet rating requirments:
    <br />
    <ajaxToolkit:Gravatar ID="Gravatar2" Email="test@gmail.com" Rating="G" DefaultImageBehavior="MysteryMan" runat="server" />
    <br />
    <hr />
    Displays different identicons (generated geometric patterns) for different emails which do not have Gravatar images:
    <br />
    <ajaxToolkit:Gravatar ID="Gravatar3" Email="Sample1@DoesNotExist.com" DefaultImageBehavior="Identicon" runat="server" />
    <ajaxToolkit:Gravatar ID="Gravatar4" Email="Sample2@DoesNotExist.com" DefaultImageBehavior="Identicon" runat="server" />
    <ajaxToolkit:Gravatar ID="Gravatar5" Email="Sample3@DoesNotExist.com" DefaultImageBehavior="Identicon" runat="server" />
    <br />
    <hr />
    Displays different wavatars (generated faces) for different emails which do not have Gravatar images:
    <br />
    <ajaxToolkit:Gravatar ID="Gravatar6" Email="Sample1@DoesNotExist.com" DefaultImageBehavior="Wavatar" runat="server" />
    <ajaxToolkit:Gravatar ID="Gravatar7" Email="Sample2@DoesNotExist.com" DefaultImageBehavior="Wavatar" runat="server" />
    <ajaxToolkit:Gravatar ID="Gravatar8" Email="Sample3@DoesNotExist.com" DefaultImageBehavior="Wavatar" runat="server" />
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>Gravatar Description</Header>
        <Content>
            <div runat="server" data-control-type="Gravatar" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Gravatar Properties</Header>
        <Content>
            <div runat="server" data-control-type="Gravatar" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
