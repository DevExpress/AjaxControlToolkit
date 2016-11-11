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
            <div runat="server" data-control-type="Accordion" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Accordion Members</Header>
        <Content>
            <div runat="server" data-control-type="Accordion" data-content-type="members" />
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
