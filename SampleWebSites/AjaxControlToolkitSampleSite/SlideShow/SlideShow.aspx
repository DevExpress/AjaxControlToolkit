<%@ Page 
    Language="C#" 
    MasterPageFile="~/DefaultMaster.master" 
    AutoEventWireup="true"
    Title="SlideShow Sample" 
    Theme="SampleSiteTheme" %>
<%@ Register 
    Assembly="AjaxControlToolkit" 
    Namespace="AjaxControlToolkit" 
    TagPrefix="ajaxToolkit" %>
    
<asp:Content ID="Content2" ContentPlaceHolderID="SampleContent" runat="Server">
    <script runat="Server" type="text/C#">
        [System.Web.Services.WebMethod]
        [System.Web.Script.Services.ScriptMethod]
        public static AjaxControlToolkit.Slide[] GetSlides()
        {
            return new AjaxControlToolkit.Slide[] { 
            new AjaxControlToolkit.Slide("images/Blue hills.jpg", "Blue Hills", "Go Blue"),
            new AjaxControlToolkit.Slide("images/Sunset.jpg", "Sunset", "Setting sun"),
            new AjaxControlToolkit.Slide("images/Winter.jpg", "Winter", "Wintery..."),
            new AjaxControlToolkit.Slide("images/Water lilies.jpg", "Water lillies", "Lillies in the water"),
            new AjaxControlToolkit.Slide("images/VerticalPicture.jpg", "Sedona", "Portrait style picture")};
        }
    </script>

    <div class="demoarea">
        <div class="demoheading">
            SlideShow Demonstration</div>
        <br />
        <br />
        <ajaxToolkit:ToolkitScriptManager ID="ScriptManager1" runat="server" />
        <div style="text-align:center">
            <asp:Label runat="Server" ID="imageTitle" CssClass="slideTitle"/><br />
            <asp:Image ID="Image1" runat="server" 
                Height="300"
                Style="border: 1px solid black;width:auto" 
                ImageUrl="~/SlideShow/images/Blue hills.jpg"
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
                Loop="true" />
        </div>
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            SlideShow Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            SlideShow is an extender that targets image controls. You can provide it with buttons to hit previous,
            next and  play. You can configure the slideshow to play automatically on render, allow it loop through the
            images in a round robin fashion and also set the interval for slide transitions. You can use a page method to
            supply images to the slide show or use a webservice. In the sample above we have provided you with a slideshow that
            plays automatically on render and loops around to the first picture if you hit next on the last picture and vice 
            versa if you hit previous on the first picture. The slideshow transitions pictures after 3 seconds.
            <br />
            <br />
         
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            SlideShow Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>
    <pre>&lt;ajaxToolkit:SlideShowExtender ID="SlideShowExtender1" runat="server" 
    TargetControlID="Image1" 
    SlideShowServiceMethod="GetSlides" 
    <em>AutoPlay="true" </em>
    <em>ImageTitleLabelID="imageTitle"</em>
    <em>ImageDescriptionLabelID="imageDescription"</em>
    <em>NextButtonID="nextButton" </em>
    <em>PlayButtonText="Play" </em>
    <em>StopButtonText="Stop" </em>
    <em>PreviousButtonID="prevButton" </em>
    <em>PlayButtonID="playButton" </em>
    <em>Loop="true" </em>/&gt; </pre>
        <ul>
            <li><strong>SlideShowServicePath</strong> - Path to the webservice that the extender will pull the images from.</li>
            <li><strong>SlideShowServiceMethod</strong> - The webservice method that will be called to supply images. 
                The signature of the method must match this:
    <pre>
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public AjaxControlToolkit.Slide[] GetSlides() { ... }</pre>
                Note that you can replace "GetSlides" with a name of your choice, but the return type
                and parameter name and type must exactly match, including case.</li>
            <li><strong>ContextKey</strong> - User/page specific context provided to an optional overload of the
                web method described by ServiceMethod/ServicePath.  If the context key is used, it should have the
                same signature with an additional parameter named contextKey of type string:
                <pre>
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public AjaxControlToolkit.Slide[] GetSlides(string contextKey) { ... }</pre>
                Note that you can replace "GetSlides" with a name of your choice, but the return type
                and parameter name and type must exactly match, including case.</li>
            <li><strong>UseContextKey</strong> - Whether or not the ContextKey property should be used.  This
                will be automatically enabled if the ContextKey property is ever set (on either the client or
                the server).  If the context key is used, it should have the same signature with an additional
                parameter named contextKey of type string (as described above).</li>
            <li><strong>NextButtonID</strong> - ID of the button that will allow you to see the next picture.</li>
            <li><strong>PlayButtonID</strong> - ID of the button that will allow you to play/stop the slideshow.</li>
            <li><strong>PreviousButtonID</strong> - ID of the button that will allow you to see the previous picture.</li>
            <li><strong>PlayButtonText</strong> - The text to be shown in the play button to play the slideshow.</li>
            <li><strong>StopButtonText</strong> - The text to be shown in the play button to stop the slideshow.</li>
            <li><strong>PlayInterval</strong> - Interval in milliseconds between slide transitions in play mode.</li>
            <li><strong>ImageTitleLabelID</strong> - ID of Label displaying current picture's title.</li>
            <li><strong>ImageDescriptionLabelID</strong> - ID of Label describing current picture.</li>
            <li><strong>Loop</strong> - Setting this to true will allow you to view images in a round-robin fashion.</li>
            <li><strong>AutoPlay</strong> - Setting this to true will play the slideshow automatically on render.</li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender runat="Server"  ID="cpeDescription" 
        TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" 
        CollapseControlID="Description_HeaderPanel"
        Collapsed="False" 
        ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender runat="Server" ID="cpeProperties" 
        TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" 
        CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" 
        ImageControlID="Properties_ToggleImage" />
</asp:Content>
