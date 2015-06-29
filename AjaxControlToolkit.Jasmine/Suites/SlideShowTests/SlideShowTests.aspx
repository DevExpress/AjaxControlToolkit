<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="SlideShowTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.SliderTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    SlideShow
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">
    <script runat="server" type="text/c#">
    
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static AjaxControlToolkit.Slide[] GetSlides() {
            return new AjaxControlToolkit.Slide[] {
                new AjaxControlToolkit.Slide("Images/blue_hills.jpg", "Blue Hills", "Go Blue", "Images/blue_hills.jpg"),
                new AjaxControlToolkit.Slide("Images/sunset.jpg", "Sunset", "Setting sun", "Images/sunset.jpg"),
                new AjaxControlToolkit.Slide("Images/winter.jpg", "Winter", "Wintery...", "Images/winter.jpg"),
                new AjaxControlToolkit.Slide("Images/water_lillies.jpg", "Water lillies", "Lillies in the water", "Images/water_lillies.jpg"),
                new AjaxControlToolkit.Slide("Images/vertical_picture.jpg", "Sedona", "Portrait style picture", "Images/vertical_picture.jpg")};
        }
    </script>

    <asp:Label runat="server" ID="ImageTitle" CssClass="slide-title" />
    <br />

    <asp:Image ID="TestImage" runat="server"
        Height="300"
        Width="400"
        Style="border: 1px solid black;"
        AlternateText="Blue Hills image" />

    <asp:Label runat="server" ID="imageDescription" CssClass="slide-description"></asp:Label>
    <br />
    <br />
    <asp:Button runat="Server" ID="PrevButton" Text="Previous" Font-Size="Larger" />
    <asp:Button runat="Server" ID="PlayButton" Text="Play" Font-Size="Larger" />
    <asp:Button runat="Server" ID="NextButton" Text="Next" Font-Size="Larger" />

    <act:SlideShowExtender id="TestSlideShow" runat="server"
        TargetControlId="TestImage"
        SlideShowServiceMethod="GetSlides"
        AutoPlay="true"
        ImageTitleLabelID="imageTitle"
        ImageDescriptionLabelID="imageDescription"
        NextButtonId="nextButton"
        PlayButtonText="Play"
        StopButtonText="Stop"
        PreviousButtonID="prevButton"
        PlayButtonId="playButton"
        Loop="true" SlideShowAnimationType="SlideRight" />

    <script>
        describe("SlideShow", function() {

            beforeEach(function() {
                this.extender = $find("<%= TestSlideShow.ClientID %>");
                this.element = this.extender._element;
                
                this.$playButton = $("#<%= PlayButton.ClientID %>");
                this.$prevButton = $("#<%= PrevButton.ClientID %>");
                this.$nextButton = $("#<%= NextButton.ClientID %>");
            });

            it("disables prev and next buttons after play button pressed", function() {
                this.$playButton.click();
                
                expect(this.$prevButton.is(":disabled")).toBeTruthy();
                expect(this.$nextButton.is(":disabled")).toBeTruthy();
            });
        });
    </script>
</asp:Content>
