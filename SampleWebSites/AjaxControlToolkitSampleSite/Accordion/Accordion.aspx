<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Inherits="CommonPage"
    Title="Accordion Sample"    
    Theme="SampleSiteTheme"%>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="server" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">Accordion Demonstration</div>
    
        <ajaxToolkit:Accordion ID="MyAccordion" runat="server" SelectedIndex="0"
            HeaderCssClass="accordionHeader" HeaderSelectedCssClass="accordionHeaderSelected"
            ContentCssClass="accordionContent" FadeTransitions="false" FramesPerSecond="40" 
            TransitionDuration="250" AutoSize="None" RequireOpenedPane="false" SuppressHeaderPostbacks="true">
           <Panes>
            <ajaxToolkit:AccordionPane ID="AccordionPane1" runat="server">
                <Header><a href="" class="accordionLink">1. Accordion</a></Header>
                <Content>
                    The Accordion is a web control that allows you to provide multiple panes and display them one at a time.
                    It is like having several <asp:HyperLink runat="server" NavigateUrl="~/CollapsiblePanel/CollapsiblePanel.aspx" Text="CollapsiblePanels" />
                    where only one can be expanded at a time.  The Accordion is implemented as a web control that contains
                    AccordionPane web controls. Each AccordionPane control has a template for its Header and its Content.
                    We keep track of the selected pane so it stays visible across postbacks.
                </Content>
            </ajaxToolkit:AccordionPane>
            <ajaxToolkit:AccordionPane ID="AccordionPane2" runat="server">
                <Header><a href="" class="accordionLink">2. AutoSize</a></Header>
                <Content>
                    <p>It also supports three AutoSize modes so it can fit in a variety of layouts.</p>
                    <ul>
                        <li><b>None</b> - The Accordion grows/shrinks without restriction.  This can cause other elements
                            on your page to move up and down with it.</li>
                        <li><b>Limit</b> - The Accordion never grows larger than the value specified by its Height
                            property.  This will cause the content to scroll if it is too large to be displayed.</li>
                        <li><b>Fill</b> - The Accordion always stays the exact same size as its Height property.  This
                            will cause the content to be expanded or shrunk if it isn't the right size.</li>
                    </ul>
                    
                </Content>
            </ajaxToolkit:AccordionPane>
            <ajaxToolkit:AccordionPane ID="AccordionPane3" runat="server">
                <Header><a href="" class="accordionLink">3. Control or Extender</a></Header>
                <Content>
                    The Accordion is written using an extender like most of the other extenders in the AJAX Control Toolkit.
                    The extender expects its input in a very specific hierarchy of container elements (like divs), so
                    the Accordion and AccordionPane web controls are used to generate the expected input for the extender.
                    The extender can also be used on its own if you provide it appropriate input.
                </Content>
            </ajaxToolkit:AccordionPane>
            <ajaxToolkit:AccordionPane ID="AccordionPane4" runat="server">
                <Header><a href="" class="accordionLink">4. What is ASP.NET AJAX?</a></Header>
                <Content>
                    <asp:Image ID="Image1" runat="server" ImageUrl="~/images/AJAX.gif" AlternateText="ASP.NET AJAX" ImageAlign="right" />
                    <%= GetContentFillerText()%>
                </Content>
            </ajaxToolkit:AccordionPane>
            </Panes>
        </ajaxToolkit:Accordion>
        
        Fade Transitions: <input id="fade" type="checkbox" onclick="toggleFade();" value="false" /><br />
        AutoSize: <select id="autosize" onchange="changeAutoSize();">
            <option selected="selected">None</option>
            <option>Limit</option>
            <option>Fill</option>
        </select>
        
        <script language="javascript" type="text/javascript">
            function toggleFade() {
                var behavior = $find('ctl00_SampleContent_MyAccordion_AccordionExtender');
                if (behavior) {
                    behavior.set_FadeTransitions(!behavior.get_FadeTransitions());
                }
            }
            function changeAutoSize() {
                var behavior = $find('ctl00_SampleContent_MyAccordion_AccordionExtender');
                var ctrl = $get('autosize');
                if (behavior) {
                    var size = 'None';
                    switch (ctrl.selectedIndex) {
                        case 0 :
                            behavior.get_element().style.height = 'auto';
                            size = Sys.Extended.UI.AutoSize.None;
                            break;
                        case 1 :
                            behavior.get_element().style.height = '400px';
                            size = Sys.Extended.UI.AutoSize.Limit;
                            break;
                        case 2 :
                            behavior.get_element().style.height = '400px';
                            size = Sys.Extended.UI.AutoSize.Fill;
                            break;
                    }
                    behavior.set_AutoSize(size);
                }
                if (document.focus) {
                    document.focus();
                }
            }
        </script>
    </div>
    <div class="demobottom"></div>
    
    <asp:Panel ID="description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse"  />
            Accordion Description
        </div>
    </asp:Panel>
    <asp:Panel id="description_ContentPanel" runat="server" style="overflow:hidden;">
        <p>
            The Accordion is a web control that allows you to provide multiple panes and display them one at a time.
            It is like having several <asp:HyperLink runat="server" NavigateUrl="~/CollapsiblePanel/CollapsiblePanel.aspx" Text="CollapsiblePanels" />
            where only one can be expanded at a time.  The Accordion is implemented as a web control that contains
            AccordionPane web controls. Each AccordionPane control has a template for its Header and its Content.
            We keep track of the selected pane so it stays visible across postbacks.
        </p>
        <br />
        It also supports three AutoSize modes so it can fit in a variety of layouts.
        <ul>
            <li><b>None</b> - The Accordion grows/shrinks without restriction.  This can cause other elements on your
                page to move up and down with it.</li>            
            <li><b>Limit</b> - The Accordion never grows larger than the value specified by its Height property.  This
                will cause the content to scroll if it is too large to be displayed.</li>
            <li><b>Fill</b> - The Accordion always stays the exact same size as its Height property.  This will cause
                the content to be expanded or shrunk if it isn't the right size.</li>
        </ul>
        <p>
            The Accordion is written using an extender like most of the other extenders in the AJAX Control Toolkit.  The
            extender expects its input in a very specific hierarchy of container elements (like divs), so the Accordion
            and AccordionPane web controls are used to generate the expected input for the extender.  The extender can also be
            used on its own if you provide it appropriate input.
        </p>
        <br />
        <p>
            The Accordion can also be databound.  Simply specify a data source through the <b>DataSource</b> or
            <b>DataSourceID</b> properties and then set your data items in the HeaderTemplate and ContentTemplate properties.
        </p>
    </asp:Panel>

    <asp:Panel ID="properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand"  />
            Accordion Properties
        </div>
    </asp:Panel>
    <asp:Panel id="properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
        <p>The control above is initialized with this code. The <em>italic</em> properties are optional:</p>
<pre>&lt;ajaxToolkit:Accordion
    <em>ID</em>="MyAccordion"
    runat="Server"
    <em>SelectedIndex</em>="0"
    <em>HeaderCssClass</em>="accordionHeader"
    <em>HeaderSelectedCssClass</em>="accordionHeaderSelected"
    <em>ContentCssClass</em>="accordionContent"
    <em>AutoSize</em>="None"
    <em>FadeTransitions</em>="true"
    <em>TransitionDuration</em>="250"
    <em>FramesPerSecond</em>="40"
    <em>RequireOpenedPane</em>="false"
    <em>SuppressHeaderPostbacks</em>="true"&gt;
    <strong><em>&lt;Panes&gt;</em></strong>
        &lt;ajaxToolkit:AccordionPane
            <em>HeaderCssClass</em>="accordionHeader"
            <em>HeaderSelectedCssClass</em>="accordionHeaderSelected"
            <em>ContentCssClass</em>="accordionContent"&gt;
            &lt;Header&gt; . . . &lt;/Header&gt;
            &lt;Content&gt; . . . &lt;/Content&gt;
        &lt;/ajaxToolkit:AccordionPane&gt;        
        .
        .
        .
    <strong><em>&lt;/Panes&gt;</em></strong>            
    <em>&lt;HeaderTemplate&gt;...&lt;/HeaderTemplate&gt;</em>
    <em>&lt;ContentTemplate&gt;...&lt;/ContentTemplate&gt;</em>
&lt;/ajaxToolkit:Accordion&gt;</pre>
        <ul>
            <li><strong>SelectedIndex</strong> - The AccordionPane to be initially visible</li>
            <li><strong>HeaderCssClass</strong> - Name of the CSS class to use for the headers.  This can be either applied to the Accordion as a default for all AccordionPanes, or an individual AccordionPane.</li>
            <li><strong>HeaderSelectedCssClass</strong> - Name of the CSS class to use for the selected header.  This can be either applied to the Accordion as a default for all AccordionPanes, or an individual AccordionPane.</li>
            <li><strong>ContentCssClass</strong> - Name of the CSS class to use for the content.  This can be either applied to the Accordion as a default for all AccordionPanes, or an individual AccordionPane.</li>
            <li><strong>FadeTransitions</strong> - True to use the fading transition effect, false for standard transitions.</li>
            <li><strong>TransitionDuration</strong> - Number of milliseconds to animate the transitions</li>
            <li><strong>FramesPerSecond</strong> - Number of frames per second used in the transition animations</li>
            <li><strong>AutoSize</strong> - Restrict the growth of the Accordion.  The values of the AutoSize enumeration are described above.</li>
            <li><strong>RequireOpenedPane</strong> - Prevent closing the currently opened pane when its header is clicked (which ensures one pane is always open).  The default value is true.</li>
            <li><strong>SuppressHeaderPostbacks</strong> - Prevent the client-side click handlers of elements inside a header from firing (this is especially useful when you want to include hyperlinks in your headers for accessibility)</li>
            <li><strong>Panes</strong> - Collection of AccordionPane controls</li>
            <li><strong>HeaderTemplate</strong> - The Header template contains the markup that should be used for an pane's header when databinding</li>
            <li><strong>ContentTemplate</strong> - The Content template contains the markup that should be used for a pane's content when databinding</li>
            <li><strong>DataSource</strong> - The data source to use.  DataBind() must be called.</li>
            <li><strong>DataSourceID</strong> - The ID of the data source to use.</li>
            <li><strong>DataMember</strong> - The member to bind to when using a DataSourceID</li>
        </ul>        
    </asp:Panel>
    <asp:Panel ID="KnownIssues_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="KnownIssues_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse"  />
            Accordion Known Issues
        </div>
    </asp:Panel>
    <asp:Panel id="KnownIssues_ContentPanel" runat="server" style="overflow:hidden;">
        <p>
            The AutoSize "Limit" mode works exactly the same as the "Fill" mode for Internet Explorer 6 and 7 because
            they do not support the max-height CSS property.
        </p>
        <br />
        <p>
            If you place the Accordion inside a &lt;table&gt; tag and have FadeTransitions set to true in
            Internet Explorer 6, it will affect the spacing between Accordion Panes.
        </p>
        <br />
        <p>
            Also, when viewing the demo in Internet Explorer 6, maximizing the browser at higher resolutions
            like 1600 x 1200 will cause the transitions to animate slower than at lower resolutions like 1280 x 1024.
        </p>
    </asp:Panel>    
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" 
        TargetControlID="description_ContentPanel"
        ExpandControlID="description_HeaderPanel"
        CollapseControlID="description_HeaderPanel"
        Collapsed="False" 
        ImageControlID="description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" 
        TargetControlID="properties_ContentPanel"
        ExpandControlID="properties_HeaderPanel"
        CollapseControlID="properties_HeaderPanel"
        Collapsed="True" 
        ImageControlID="properties_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeKnownIssues" runat="Server" 
        TargetControlID="KnownIssues_ContentPanel"
        ExpandControlID="KnownIssues_HeaderPanel"
        CollapseControlID="KnownIssues_HeaderPanel"
        Collapsed="False"
        ImageControlID="KnownIssues_ToggleImage" />        
</asp:Content>