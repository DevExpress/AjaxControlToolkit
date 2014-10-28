<%@ Page Title="DropShadow Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="DropShadow.aspx.cs" Inherits="DropShadow_DropShadow" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    DropShadow Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:Panel ID="Panel1" runat="server" CssClass="dropShadowPanel">
        <div style="padding: 10px">
            First Name:
            <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox><br />
            Last Name:
            <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox><br />
            <hr />

            <asp:Panel ID="CollapseHeader" runat="server" Style="cursor: pointer;">
                <asp:Label ID="Label1" runat="server" Text="Label">Show Details...</asp:Label>
            </asp:Panel>
            <asp:Panel ID="Panel2" runat="server" Style="overflow: hidden; height: 0">
                Not many details here.  This is just a demo to show how the DropShadow will react
                    properly to changes in the size of the panel it is attached to.               
            </asp:Panel>
            <ajaxToolkit:CollapsiblePanelExtender ID="cpe1" runat="Server"
                TargetControlID="Panel2"
                Collapsed="true"
                CollapsedText="Show Details..."
                ExpandedText="Hide Details"
                TextLabelID="Label1"
                ExpandControlID="CollapseHeader"
                CollapseControlID="CollapseHeader"
                SuppressPostBack="true" />
        </div>
    </asp:Panel>

    <ajaxToolkit:DropShadowExtender ID="DropShadowExtender1" runat="server"
        BehaviorID="DropShadowBehavior1"
        TargetControlID="Panel1"
        Width="5"
        Rounded="true"
        Radius="6"
        Opacity=".75"
        TrackPosition="true" />

    <div style="padding: 15px;">
        <label for="chkShadow">Show Drop Shadow: </label>
        <input type="checkbox" checked="checked" id="chkShadow"
            onclick="var b = $find('DropShadowBehavior1'); b.set_Width(chkShadow.checked ? 5 : 0);" /><br />
        <label for="chkRounded">Rounded: </label>
        <input type="checkbox" id="chkRounded" checked="checked"
            onclick="var b = $find('DropShadowBehavior1'); b.set_Rounded(chkRounded.checked);" />
        <div>
            Radius:
            <input type="radio" id="radius2" name="radiusValues" value="2"
                onclick="$find('DropShadowBehavior1').set_Radius(this.value);" />
            <label for="radius2">2</label>
            <input type="radio" id="radius4" name="radiusValues" value="4"
                onclick="$find('DropShadowBehavior1').set_Radius(this.value);" />
            <label for="radius4">4</label>
            <input type="radio" id="radius6" name="radiusValues" value="6"
                onclick="$find('DropShadowBehavior1').set_Radius(this.value);" checked="checked" />
            <label for="radius6">6</label>
            <input type="radio" id="radius10" name="radiusValues" value="10"
                onclick="$find('DropShadowBehavior1').set_Radius(this.value);" />
            <label for="radius10">10</label>
        </div>
        <div>
            Opacity:
            <input type="radio" id="opacity25" name="opacityValues" value=".25"
                onclick="$find('DropShadowBehavior1').set_Opacity(this.value);" />
            <label for="opacity25">25%</label>
            <input type="radio" id="opacity50" name="opacityValues" value=".5"
                onclick="$find('DropShadowBehavior1').set_Opacity(this.value);" />
            <label for="opacity50">50%</label>
            <input type="radio" id="opacity75" name="opacityValues" value=".75"
                onclick="$find('DropShadowBehavior1').set_Opacity(this.value);" checked="checked" />
            <label for="opacity75">75%</label>
            <input type="radio" id="opacity100" name="opacityValues" value="1.0"
                onclick="$find('DropShadowBehavior1').set_Opacity(this.value);" />
            <label for="opacity100">100%</label>
        </div>
    </div>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>DropShadow Description</Header>
        <Content>
            <p>
                DropShadow is an extender which applies a "Drop Shadow" to a Panel.  It allows you to specify
                how wide the shadow is as well as how opaque it is, or if you would like rounded corners.
                For pages that allow the user to move or resize the panel, the DropShadow has a mode that
                will resize/reposition it to match that of the target panel at run time.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>DropShadow Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The properties in <em>italic</em> are optional.
            </p>
            <pre>
&lt;ajaxToolkit:DropShadowExtender ID="dse" runat="server"
    TargetControlID="Panel1" 
    <em>Opacity=".8" 
    Rounded="true"
    TrackPosition="true"</em> /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the button or link for this extender to operate on</li>
                <li><strong>Width - </strong>The width, in pixels of the drop shadow. Default value is 5.</li><li><strong>Opacity </strong> - The opacity of the drop shadow, from 0 (fully transparent) to 1.0 (fully opaque). The default value is .5.</li>
                <li><strong>TrackPosition</strong> - Whether the drop shadow should track the position of the panel it is attached to. Use this if the panel is absolutely positioned or will otherwise move.</li>
                <li><strong>Rounded</strong> - Set to true to set rounded corners on the target and the shadow. Default is false.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
