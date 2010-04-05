<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="Tabs.aspx.cs"
    Inherits="Tabs_Tabs"
    Title="Tabs Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <script type="text/javascript">
        function PanelClick(sender, e) {
            var Messages = $get('<%=Messages.ClientID%>');
            Highlight(Messages);
        }

        function ActiveTabChanged(sender, e) {
            var CurrentTab = $get('<%=CurrentTab.ClientID%>');
            CurrentTab.innerHTML = sender.get_activeTab().get_headerText();
            Highlight(CurrentTab);
        }

        var HighlightAnimations = {};
        function Highlight(el) {
            if (HighlightAnimations[el.uniqueID] == null) {
                HighlightAnimations[el.uniqueID] = AjaxControlToolkit.Animation.createAnimation({
                    AnimationName : "color",
                    duration : 0.5,
                    property : "style",
                    propertyKey : "backgroundColor",
                    startValue : "#FFFF90",
                    endValue : "#FFFFFF"
                }, el);
            }
            HighlightAnimations[el.uniqueID].stop();
            HighlightAnimations[el.uniqueID].play();
        }
        
        function ToggleHidden(value) {
            $find('<%=Tabs.ClientID%>').get_tabs()[2].set_enabled(value);
        }
    </script>
    <div class="demoarea">
        <div class="demoheading">Tabs Demonstration</div>
        The following user profile is presented in Tab format. You can click on the tab
        and modify specific fields.
        <br /><br />
        
        Toolkit User Profile:
        <ajaxToolkit:TabContainer runat="server" ID="Tabs" Height="138px" OnClientActiveTabChanged="ActiveTabChanged" ActiveTabIndex="0" Width="402px">
            <ajaxToolkit:TabPanel runat="server" ID="Panel1" HeaderText="Signature and Bio">
                <ContentTemplate>
                    <asp:UpdatePanel ID="updatePanel1" runat="server">
                        <ContentTemplate>
                            <table>
                                <tr>
                                    <td>
                                        Signature:</td>
                                    <td>
                                        <asp:TextBox ID="signatureText" runat="server" /></td>
                                </tr>
                                <tr>
                                    <td>
                                        Bio:</td>
                                    <td>
                                        <asp:TextBox ID="bioText" runat="server" /></td>
                                </tr>
                            </table>
                            <asp:Button ID="Button3" runat="Server" Text="Save" OnClick="SaveProfile" />
                            <br /><br />
                            Hit Save to cause a postback from an update panel inside the tab panel.<br />
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            
            <ajaxToolkit:TabPanel runat="server" ID="Panel3" HeaderText="Email" >
                <ContentTemplate>
                    Email: <asp:TextBox ID="emailText" runat="server" />
                    <br /><br />
                    <asp:Button ID="Button1" runat="server" Text="Save" OnClick="SaveProfile" />
                    <br /><br />
                    Hit Save to cause a full postback.
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
        
            <ajaxToolkit:TabPanel runat="server" ID="Panel2" OnClientClick="PanelClick" HeaderText="Controls">
                <ContentTemplate>
                    <div>Controls authored by Toolkit User (read-only - demo purposes):</div>
                    <ul>
                        <li>Calendar</li>
                        <li>MaskedEdit</li>
                        <li>Accordion</li>
                        <li>Calendar</li>
                        <li>Calendar</li>
                    </ul>
                    <br />
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
                    &nbsp;
           
        </ajaxToolkit:TabContainer>
        <br />
        
        <asp:CheckBox runat="server" ID="showComponents" Checked="true"
            Text=" Show Controls Owned" onclick="ToggleHidden(this.checked)" />
        <br /><br />
        
        Current Tab:
        <asp:Label runat="server" ID="CurrentTab" /><br />
        <asp:Label runat="server" ID="Messages" />
    </div>
    <div class="demobottom"></div>
    
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            Tabs Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            TabContainer is an ASP.NET AJAX Control which creates a set of Tabs that can be
            used to organize page content. A TabContainer is a host for a number of TabPanel
            controls.
            <br /><br />
            Each TabPanel defines its HeaderText or HeaderTemplate as well as a ContentTemplate
            that defines its content. The most recent tab should remain selected after a postback,
            and the Enabled state of tabs should remain after a postback as well.
        </p>
    </asp:Panel>
    
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            Tabs Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;" Height="0px">
        <p>The control above is initialized with this code.  The <em>italic</em> properties are optional:</p>
<pre>&lt;ajaxToolkit:TabContainer runat="server" 
        <em>OnClientActiveTabChanged</em>="ClientFunction" 
        <em>Height</em>="150px"&gt;
    <strong>&lt;ajaxToolkit:TabPanel</strong> runat="server" 
        <em>HeaderText</em>="Signature and Bio"
        &lt;ContentTemplate&gt;
            ...
        &lt;/ContentTemplate&gt;
    <strong>/&gt;</strong>
&lt;/ajaxToolkit:TabContainer&gt;</pre>
        <b>TabContainer Properties</b>
        <ul>
            <li><strong>ActiveTabChanged (Event)</strong> - Fired on the server side when a tab
                is changed after a postback</li>
            <li><strong>OnClientActiveTabChanged</strong> - The name of a javascript function to
                attach to the client-side tabChanged event</li>
            <li><strong>CssClass</strong> - A css class override used to define a custom look and
                feel for the tabs. See the Tabs Theming section for more details.</li>
            <li><strong>ActiveTabIndex</strong> - The first tab to show</li>
            <li><strong>Height</strong> - sets the height of the body of the tabs (does not include
                the TabPanel headers)</li>
            <li><strong>Width</strong> - sets the width of the body of the tabs</li>
            <li><strong>ScrollBars</strong> - Whether to display scrollbars (None, Horizontal,
                Vertical, Both, Auto) in the body of the TabContainer</li>
            <li><strong>TabStripPlacement</strong> - Whether to render the tabs on top of the container or below 
                (Top, Bottom) </li>
        </ul>
        <b>TabPanel Properties</b>
        <ul>
            <li><strong>Enabled</strong> - Whether to display the Tab for the TabPanel by default.
                This can be changed on the client.</li>
            <li><strong>OnClientClick</strong> - The name of a javascript function to attach to
                the client-side click event of the tab.</li>
            <li><strong>HeaderText</strong> - The text to display in the Tab</li>
            <li><strong>HeaderTemplate</strong> - A TemplateInstance.Single ITemplate to use to
                render the header</li>
            <li><strong>ContentTemplate</strong> - A TemplateInstance.Single ITemplate to use to
                render the body</li>
        </ul>
    </asp:Panel>
    
    <asp:Panel runat="server" ID="TabCSS_HeaderPanel" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="TabCSS_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            Tabs Theming
        </div>
    </asp:Panel>
    <asp:Panel runat="server" ID="TabCSS_ContentPanel" Style="overflow: hidden;" Height="0px">
        You can change the look and feel of Tabs using the Tabs CssClass property. Tabs
        has a predefined set of CSS classes that can be overridden. It has a default style
        which is embedded as a WebResource and is a part of the Toolkit assembly that has
        styles set for all the sub-classes. You can find the default styles in the Toolkit
        solution in the <strong>"AjaxControlToolkit\Tabs\Tabs.css"</strong> file. If your
        CssClass does not provide values for any of those then it falls back to the default
        value. In the example above the default style is used. To customize the same the
        user would have to set the CssClass property to the name of the CSS style and define
        the styles for the individual classes so that the various elements in a Tab control
        can be styled accordingly. For example if the CssClass property was set to "CustomTabStyle"
        this is how the css to style the tab header would look:
        <pre>
.CustomTabStyle .ajax__tab_header {
    font-family:verdana,tahoma,helvetica;
    font-size:11px;
    background:url(images/tab-line.gif) repeat-x bottom;
}</pre>
        <strong>Tabs Css classes</strong>
        <br />
        <ul>
            <li><strong>.ajax__tab_header:</strong>
                A container element that wraps all of the tabs at the top of the TabContainer.
                Child CSS classes:.ajax__tab_outer. </li>
            <li><strong>.ajax__tab_outer:</strong> An outer element of a tab, often used to set
                the left-side background image of the tab.Child CSS classes: .ajax__tab_inner.
            </li>
            <li><strong>.ajax__tab_inner:</strong> An inner element of a tab, often used to set
                the right-side image of the tab. Child CSS classes:.ajax__tab_tab. </li>
            <li><strong>.ajax__tab_tab:</strong> An element of the tab that
                contains the text content. Child CSS classes:none.</li>
            <li><strong>.ajax__tab_body</strong>: A container element that wraps the area where
                a TabPanel is displayed. Child CSS classes: none.</li>
            <li><strong>.ajax__tab_hover</strong> . This is applied to a tab when the mouse is hovering
                over. Child CSS classes:.ajax__tab_outer. </li>
            <li><strong>.ajax__tab_active</strong>: This is applied to a tab when it is the currently
                selected tab. Child CSS classes:.ajax__tab_outer. </li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeTabsCSS" runat="Server" TargetControlID="TabCSS_ContentPanel"
        ExpandControlID="TabCSS_HeaderPanel" CollapseControlID="TabCSS_HeaderPanel" Collapsed="True"
        ImageControlID="TabCSS_ToggleImage" />
</asp:Content>
