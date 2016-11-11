<%@ Page Title="SlideShow Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="SlideShow.aspx.cs" Inherits="SlideShow_SlideShow" %>

<asp:Content ContentPlaceHolderID="DemoHeading" Runat="Server">
    SlideShow Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" Runat="Server">
    <script runat="Server" type="text/C#">
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static AjaxControlToolkit.Slide[] GetSlides()
        {
            return new AjaxControlToolkit.Slide[] { 
            new AjaxControlToolkit.Slide("images/Blue hills.jpg", "Blue Hills", "Go Blue", "images/Blue hills.jpg"),
            new AjaxControlToolkit.Slide("images/Sunset.jpg", "Sunset", "Setting sun", "images/Sunset.jpg"),
            new AjaxControlToolkit.Slide("images/Winter.jpg", "Winter", "Wintery...", "images/Winter.jpg"),
            new AjaxControlToolkit.Slide("images/Water lilies.jpg", "Water lillies", "Lillies in the water", "images/Water lilies.jpg"),
            new AjaxControlToolkit.Slide("images/VerticalPicture.jpg", "Sedona", "Portrait style picture", "images/VerticalPicture.jpg")};
        }
    </script>

    <div style="text-align:center">
            <asp:Label runat="Server" ID="imageTitle" CssClass="slideTitle"/><br />
            <asp:Image ID="Image1" runat="server" 
                Height="300"
                Width="400"
                Style="border: 1px solid black;"                 
                AlternateText="Blue Hills image" />
            <asp:Label runat="server" ID="imageDescription" CssClass="slideDescription"></asp:Label><br /><br />
            <asp:Button runat="Server" ID="prevButton" Text="Prev" Font-Size="Larger" />
            <asp:Button runat="Server" ID="playButton" Text="Play" Font-Size="Larger" />
            <asp:Button runat="Server" ID="nextButton" Text="Next" Font-Size="Larger" />
            <ajaxToolkit:SlideShowExtender ID="slideshowextend1" runat="server" 
                TargetControlID="Image1"
                SlideShowServiceMethod="GetSlides" 
                AutoPlay="true" 
                ImageTitleLabelID="imageTitle"
                ImageDescriptionLabelID="imageDescription"
                NextButtonID="nextButton" 
                PlayButtonText="Play" 
                StopButtonText="Stop"
                PreviousButtonID="prevButton" 
                PlayButtonID="playButton" 
                Loop="true" SlideShowAnimationType="SlideRight" />
        </div>
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" Runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>SlideShow Description</Header>
        <Content>
            <div runat="server" data-control-type="SlideShowExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>SlideShow Properties</Header>
        <Content>
             <div runat="server" data-control-type="SlideShowExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>
