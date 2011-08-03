<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="HTMLEditor.aspx.cs"
    Inherits="HTMLEditor_Editor"
    Title="HTMLEditor Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit.HTMLEditor"
    TagPrefix="HTMLEditor" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div>
            Note: We recommend that you use 
            <a href="../HtmlEditorExtender/HTMLEditorExtender.aspx">the new HtmlEditorExtender</a> 
            instead of the HtmlEditor control described on this page. The HtmlEditorExtender takes advantage of HTML5 and works with IE6 and later.
    </div>
    <br />
    <div class="demoarea">
        <div class="demoheading">HTMLEditor Demonstration</div>
        <asp:UpdatePanel ID="updatePanel1" runat="server">
            <ContentTemplate>
                <HTMLEditor:Editor runat="server" OnContentChanged="ContentChanged" Id="editor" Height="300px" AutoFocus="true" Width="100%" />
                <asp:Label runat="server" ID="ContentChangedLabel" />
                <br />
                <asp:Button runat="server" Text="Submit content" ID="submit" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div class="demobottom"></div>
    
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            HTMLEditor Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            HTMLEditor is an ASP.NET AJAX Control that allows you to easily create and edit HTML content.
            Various buttons in toolbar are used for content editing.
            You can see generated HTML markup and preview  document.
        </p>
    </asp:Panel>
    
    <asp:Panel ID="Samples_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Samples_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            Other samples
        </div>
    </asp:Panel>
    <asp:Panel ID="Samples_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            <a href="OtherSamples/ClientSide.htm">Client-side HTMLEditor</a><br />
            <a href="OtherSamples/AnotherStyle.aspx">Custom skin with modified bottom toolbar</a><br />
            <a href="OtherSamples/Lite.aspx">Lite top toolbar</a><br />
            <a href="OtherSamples/LiteNoBottom.aspx">Lite top toolbar without bottom toolbar</a><br />
            <a href="OtherSamples/FullNoBottom.aspx"><b>HTMLEditor</b> without bottom toolbar</a><br />
            <a href="OtherSamples/Tabs.aspx"><b>HTMLEditor</b> controls inside <b>Tabs</b> control</a><br />
            <a href="OtherSamples/FullScreen.aspx">Full screen expanded</a><br />
            <a href="OtherSamples/EditorWithCustomButtons_1.aspx">Custom buttons added to the top toolbar</a><br />
        </p>
    </asp:Panel>
    
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            HTMLEditor Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>The control above is initialized with this code.  The <em>italic</em> properties are optional:</p>
<pre>&lt;%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit.HTMLEditor"
    TagPrefix="HTMLEditor" %&gt;
...
&lt;HTMLEditor:Editor runat="server" 
        <em>Height</em>="300px" 
        <em>Width</em>="100%"
        <em>AutoFocus</em>="true"
/&gt;</pre>
        <ul>
            <li><strong>ActiveMode</strong> - Active editing panel (Design, Html, Preview) on control loaded</li>
            <li><strong>AutoFocus</strong> - If true, editing panel is focused and cursor is set inside it ("Design" or "HTML text") on initial load or editing panel change</li>
            <li><strong>Content</strong> - Gets/sets HTML content of HTMLEditor</li>
            <li><strong>ContentChanged</strong> - Server-side event fired on HTML content changing</li>
            <li><strong>CssClass</strong> - A css class override used to define a custom look and
                feel for the HTMLEditor. See the HTMLEditor Theming section for more details</li>
            <li><strong>DesignPanelCssPath</strong> - Sets the path of additional CSS file used for HTMLEditor's content rendering in  "Design" panel.
                If not set, the default CSS file is used which is embedded as a WebResource and is a part of the Toolkit assembly</li>
            <li><strong>DocumentCssPath</strong> - Sets the path of CSS file used for HTMLEditor's content rendering in "Design" and "Preview" panels.
                If not set, the default CSS file is used which is embedded as a WebResource and is a part of the Toolkit assembly</li>
            <li><strong>Height</strong> - Sets the height of the body of the HTMLEditor</li>
            <li><strong>HtmlPanelCssClass</strong> - A css class override used to define a custom look
                for the HTMLEditor's "HTML text" mode panel. See the HTMLEditor Theming section for more details</li>
            <li><strong>IgnoreTab</strong> - If true, Tab key navigation is suppressed inside HTMLEditor control</li>
            <li><strong>InitialCleanUp</strong> - If true, HTMLEditor's content is cleaned up on initial load. MS Word specific tags are removed</li>
            <li><strong>NoScript</strong> - If true, <em>JavaScript</em> code is  suppressed in HTMLEditor's content</li>
            <li><strong>NoUnicode</strong> - If true, all <em>Unicode</em> characters in HTML content are replaced with <em>&#code;</em></li>
            <li><strong>OnClientActiveModeChanged</strong> - The client-side script that executes after active mode (editing panel) changed</li>
            <li><strong>OnClientBeforeActiveModeChanged</strong> - The client-side script that executes before active mode (editing panel) changed</li>
            <li><strong>SuppressTabInDesignMode</strong> - If true, no white spaces inserted on Tab key press in Design mode.
            Default Tab key navigation is processing in this case</li>
            <li><strong>TopToolbarPreservePlace</strong> - If true, the top toolbar will have the same size in all modes (Design, Html, Preview)</li>
            <li><strong>Width</strong> - Sets the width of the body of the HTMLEditor</li>
        </ul>
    </asp:Panel>
    
    <asp:Panel runat="server" ID="EditorCSS_HeaderPanel" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="EditorCSS_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            HTMLEditor Theming
        </div>
    </asp:Panel>
    <asp:Panel runat="server" ID="EditorCSS_ContentPanel" Style="overflow: hidden;" Height="0px">
        You can change the look and feel of HTMLEditor using the HTMLEditor CssClass property. HTMLEditor
        has a predefined set of CSS classes that can be overridden. It has a default style
        which is embedded as a WebResource and is a part of the Toolkit assembly that has
        styles set for all the sub-classes. You can find the default styles in the Toolkit
        solution in the <strong>"AjaxControlToolkit\HTMLEditor\Editor.css"</strong> file.
        If your CssClass does not provide values for any of those then it falls back to the default value.
        In the example above the default style is used. To customize the same the
        user would have to set the CssClass property to the name of the CSS style and define
        the styles for the individual classes so that the various elements in a HTMLEditor control
        can be styled accordingly. For example if the CssClass property was set to "CustomEditorStyle"
        this is how the css to style the HTMLEditor top toolbar would look:
        <pre>
.CustomEditorStyle .ajax__htmleditor_editor_toptoolbar {
        background-color:#F0F0F0; padding: 0px 0px 2px 2px;
}</pre>
        <strong>HTMLEditor Css classes</strong>
        <br />
        <ul>
            <li><strong>.ajax__htmleditor_editor_container</strong>:
                A container element (table) that wraps all of the HTMLEditor.
                <br /><em>Child CSS classes</em>: .ajax__htmleditor_editor_toptoolbar, .ajax__htmleditor_editor_editpanel,
                .ajax__htmleditor_editor_bottomtoolbar.
            </li>
            <li><strong>.ajax__htmleditor_editor_toptoolbar</strong>:
                A container element that wraps all buttons of the top toolbar.
                <br /><em>Child CSS classes</em>: .ajax__htmleditor_toolbar_button, .ajax__htmleditor_toolbar_button_hover.
            </li>
            <li><strong>.ajax__htmleditor_editor_editpanel</strong>:
                A container element that wraps editing panel (in any mode).
                <br /><em>Child CSS classes</em>: none.
            </li>
            <li><strong>.ajax__htmleditor_editor_bottomtoolbar</strong>:
                A container element that wraps all buttons of the bottom toolbar.
                <br /><em>Child CSS classes</em>: .ajax__htmleditor_toolbar_button, .ajax__htmleditor_toolbar_button_hover.
            </li>
            <li><strong>.ajax__htmleditor_toolbar_button</strong>:
                This is applied to a button of toolbar.
                <br /><em>Child CSS classes</em>: none.
            </li>
            <li><strong>.ajax__htmleditor_toolbar_button_hover</strong>:
                This is applied to a button of toolbar when the mouse is hovering over.
                <br /><em>Child CSS classes</em>: none.
            </li>
            <li><strong>div.ajax__htmleditor_toolbar_button label</strong>:
                This is applied to a &lt;label&gt; element of "selector button" in toolbar (Font, Size).
                <br /><em>Child CSS classes</em>: none.
            </li>
            <li><strong>div.ajax__htmleditor_toolbar_button select</strong>:
                This is applied to a &lt;select&gt; element of "selector button" in toolbar.
                <br /><em>Child CSS classes</em>: none.
            </li>
            <li><strong>div.ajax__htmleditor_toolbar_button select option</strong>:
                This is applied to &lt;select&gt; element's options of "selector button" in toolbar.
                <br /><em>Child CSS classes</em>: none.
            </li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeSamples" runat="Server" TargetControlID="Samples_ContentPanel"
        ExpandControlID="Samples_HeaderPanel" CollapseControlID="Samples_HeaderPanel" Collapsed="True"
        ImageControlID="Samples_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeEditorCSS" runat="Server" TargetControlID="EditorCSS_ContentPanel"
        ExpandControlID="EditorCSS_HeaderPanel" CollapseControlID="EditorCSS_HeaderPanel" Collapsed="True"
        ImageControlID="EditorCSS_ToggleImage" />
</asp:Content>
