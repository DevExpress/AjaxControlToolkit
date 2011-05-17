<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Inherits="CommonPage"
    Title="DropShadow Sample"
    Theme="SampleSiteTheme"%>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">DropShadow Demonstration</div>
        <asp:Panel ID="Panel1" runat="server" CssClass="dropShadowPanel">
            <div style="padding:10px">  
                First Name: <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox><br />
                Last Name: <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox><br />
                <hr />
           
                <asp:Panel ID="CollapseHeader" runat="server" style="cursor: pointer;">
                    <asp:Label ID="Label1" runat="server" Text="Label">Show Details...</asp:Label>
                </asp:Panel>
                <asp:Panel ID="Panel2" runat="server" style="overflow:hidden;height:0"> 
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

        <div style="padding:15px;">
            <label for="chkShadow">Show Drop Shadow: </label>
            <input type="checkbox" checked="checked" id="chkShadow"
                onclick="var b = $find('DropShadowBehavior1'); b.set_Width(chkShadow.checked ?  5 : 0);"/><br />
            <label for="chkRounded">Rounded: </label>
            <input type="checkbox" id="chkRounded" checked="checked"
                onclick="var b = $find('DropShadowBehavior1'); b.set_Rounded(chkRounded.checked);"/>
            <div>
                Radius:
                <input type="radio" id="radius2"  name="radiusValues" value="2" 
                    onclick="$find('DropShadowBehavior1').set_Radius(this.value);" />
                <label for="radius2">2</label>
                <input type="radio" id="radius4"  name="radiusValues" value="4"
                    onclick="$find('DropShadowBehavior1').set_Radius(this.value);" />
                <label for="radius4">4</label>
                <input type="radio" id="radius6"  name="radiusValues" value="6"
                    onclick="$find('DropShadowBehavior1').set_Radius(this.value);" checked="checked" />
                <label for="radius6">6</label>
                <input type="radio" id="radius10" name="radiusValues" value="10"
                    onclick="$find('DropShadowBehavior1').set_Radius(this.value);"/>
                <label for="radius10">10</label>
            </div>
            <div>
                Opacity:
                <input type="radio" id="opacity25"  name="opacityValues" value=".25"
                    onclick="$find('DropShadowBehavior1').set_Opacity(this.value);" />
                <label for="opacity25">25%</label>
                <input type="radio" id="opacity50"  name="opacityValues" value=".5"
                    onclick="$find('DropShadowBehavior1').set_Opacity(this.value);" />
                <label for="opacity50">50%</label>
                <input type="radio" id="opacity75"  name="opacityValues" value=".75"
                    onclick="$find('DropShadowBehavior1').set_Opacity(this.value);" checked="checked" />
                <label for="opacity75">75%</label>
                <input type="radio" id="opacity100" name="opacityValues" value="1.0"
                    onclick="$find('DropShadowBehavior1').set_Opacity(this.value);"/>
                <label for="opacity100">100%</label>
            </div>
        </div>

    </div>
    <div class="demobottom"></div>

    <asp:Panel ID="Description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            DropShadow Description
        </div>
    </asp:Panel>
    <asp:Panel id="Description_ContentPanel" runat="server" style="overflow:hidden;">
        <p>
            DropShadow is an extender which applies a "Drop Shadow" to a Panel.  It allows you to specify
            how wide the shadow is as well as how opaque it is, or if you would like rounded corners.
            For pages that allow the user to move or resize the panel, the DropShadow has a mode that
            will resize/reposition it to match that of the target panel at run time.
        </p>
    </asp:Panel>

    <asp:Panel ID="Properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            DropShadow Properties
        </div>
    </asp:Panel>
    <asp:Panel id="Properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
        <p>
            The control above is initialized with this code. The properties in <em>italic</em> are optional.
        </p>
<pre>&lt;ajaxToolkit:DropShadowExtender ID="dse" runat="server"
    TargetControlID="Panel1" 
    <em>Opacity=".8" 
    Rounded="true"
    TrackPosition="true"</em> /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the button or link for this extender to operate on</li>
            <li><strong>Width - </strong>The width, in pixels of the drop shadow. Default
                value is 5.</li><li><strong>Opacity </strong> - The opacity of the drop shadow, from 0 (fully
                transparent) to 1.0 (fully opaque). The default value is .5.</li>
            <li><strong>TrackPosition</strong> - Whether the drop shadow should track the position of the panel
                it is attached to. Use this if the panel is absolutely positioned or will otherwise move.</li>
            <li><strong>Rounded</strong> - Set to true to set rounded corners on the target and the shadow.
                Default is false.</li>
        </ul>
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" 
        TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel"
        CollapseControlID="Description_HeaderPanel"
        Collapsed="False" 
        ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" 
        TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel"
        CollapseControlID="Properties_HeaderPanel"
        Collapsed="True"        
        ImageControlID="Properties_ToggleImage" />
</asp:Content>