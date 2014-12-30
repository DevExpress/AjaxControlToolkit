<%@ Page Title="Accordion Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="Accordion.aspx.cs" Inherits="Accordion_Accordion" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    Accordion Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <ajaxToolkit:Accordion ID="MyAccordion" runat="server" SelectedIndex="0"
        HeaderCssClass="accordionHeader" HeaderSelectedCssClass="accordionHeaderSelected"
        ContentCssClass="accordionContent" FadeTransitions="false" FramesPerSecond="40"
        TransitionDuration="250" AutoSize="None" RequireOpenedPane="false" SuppressHeaderPostbacks="true">
        <Panes>
            <ajaxToolkit:AccordionPane ID="AccordionPane1" runat="server">
                <Header><a href="#" class="accordionLink">1. Accordion</a></Header>
                <Content>
                    The Accordion is a web control that allows you to provide multiple panes and display them one at a time.
                    It is like having several
                    <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="~/CollapsiblePanel/CollapsiblePanel.aspx" Text="CollapsiblePanels" />
                    where only one can be expanded at a time.  The Accordion is implemented as a web control that contains
                    AccordionPane web controls. Each AccordionPane control has a template for its Header and its Content.
                    We keep track of the selected pane so it stays visible across postbacks.
                </Content>
            </ajaxToolkit:AccordionPane>
            <ajaxToolkit:AccordionPane ID="AccordionPane2" runat="server">
                <Header><a href="#" class="accordionLink">2. AutoSize</a></Header>
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
                <Header><a href="#" class="accordionLink">3. Control or Extender</a></Header>
                <Content>
                    The Accordion is written using an extender like most of the other extenders in the AJAX Control Toolkit.
                    The extender expects its input in a very specific hierarchy of container elements (like divs), so
                    the Accordion and AccordionPane web controls are used to generate the expected input for the extender.
                    The extender can also be used on its own if you provide it appropriate input.
                </Content>
            </ajaxToolkit:AccordionPane>
            <ajaxToolkit:AccordionPane ID="AccordionPane4" runat="server">
                <Header><a href="#" class="accordionLink">4. What is ASP.NET AJAX?</a></Header>
                <Content>
                    <asp:Image ID="Image1" runat="server" ImageUrl="~/images/AJAX.gif" AlternateText="ASP.NET AJAX" ImageAlign="right" />
                    <%= DemoData.ContentFillerText%>
                </Content>
            </ajaxToolkit:AccordionPane>
        </Panes>
    </ajaxToolkit:Accordion>

    Fade Transitions:
    <input id="fade" type="checkbox" onclick="toggleFade();" value="false" /><br />
    AutoSize:
    <select id="autosize" onchange="changeAutoSize();">
        <option selected="selected">None</option>
        <option>Limit</option>
        <option>Fill</option>
    </select>

    <script type="text/javascript">
        function toggleFade() {
            var behavior = $find('Content_DemoContent_MyAccordion_AccordionExtender');
            if(behavior) {
                behavior.set_FadeTransitions(!behavior.get_FadeTransitions());
            }
        }
        function changeAutoSize() {
            var behavior = $find('Content_DemoContent_MyAccordion_AccordionExtender');
            var ctrl = $get('autosize');
            if(behavior) {
                var size = 'None';
                switch(ctrl.selectedIndex) {
                    case 0:
                        behavior.get_element().style.height = 'auto';
                        size = Sys.Extended.UI.AutoSize.None;
                        break;
                    case 1:
                        behavior.get_element().style.height = '400px';
                        size = Sys.Extended.UI.AutoSize.Limit;
                        break;
                    case 2:
                        behavior.get_element().style.height = '400px';
                        size = Sys.Extended.UI.AutoSize.Fill;
                        break;
                }
                behavior.set_AutoSize(size);
            }
            if(document.focus) {
                document.focus();
            }
        }
    </script>
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>Accordion Description</Header>
        <Content>
            <p>
                The Accordion is a web control that allows you to provide multiple panes and display them one at a time. It is like having several
                <asp:HyperLink ID="HyperLink2" runat="server" NavigateUrl="~/CollapsiblePanel/CollapsiblePanel.aspx" Text="CollapsiblePanels" />
                where only one can be expanded at a time.  The Accordion is implemented as a web control that contains
                AccordionPane web controls. Each AccordionPane control has a template for its Header and its Content.
                We keep track of the selected pane so it stays visible across postbacks.
            </p>
            <br />
            It also supports three AutoSize modes so it can fit in a variety of layouts.
                <ul>
                    <li><b>None</b> - The Accordion grows/shrinks without restriction.  This can cause other elements on your page to move up and down with it.</li>
                    <li><b>Limit</b> - The Accordion never grows larger than the value specified by its Height property. This will cause the content to scroll if it is too large to be displayed.</li>
                    <li><b>Fill</b> - The Accordion always stays the exact same size as its Height property.  This will cause the content to be expanded or shrunk if it isn't the right size.</li>
                </ul>
            <p>
                The Accordion is written using an extender like most of the other extenders in the AJAX Control Toolkit.  The 
                extender expects its input in a very specific hierarchy of container elements (like divs), so the Accordion
                and AccordionPane web controls are used to generate the expected input for the extender.  The extender can also be
                used on its own if you provide it appropriate input.
            </p>
            <br />
            <p>
                The Accordion can also be databound.  Simply specify a data source through the <b>DataSource</b> or <b>DataSourceID</b> properties and then set your data items in the HeaderTemplate and ContentTemplate properties.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Accordion Properties</Header>
        <Content>
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
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header> Accordion Known Issues </Header>
        <Content>
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
        </Content>
    </samples:InfoBlock>
</asp:Content>
