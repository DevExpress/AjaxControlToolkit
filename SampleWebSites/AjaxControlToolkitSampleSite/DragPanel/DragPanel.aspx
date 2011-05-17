<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    Inherits="CommonPage"
    Title="DragPanel Sample"
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">DragPanel Demonstration</div>
        <div style="height: 300px; width: 250px; float: left; padding: 5px;" >
            <asp:Panel ID="Panel6" runat="server" Width="250px" style="z-index: 20;">
                <asp:Panel ID="Panel7" runat="server" Width="100%" Height="20px"
                    BorderStyle="Solid" BorderWidth="2px" BorderColor="black">
                        <div class="dragMe">Drag Me</div>
                </asp:Panel>
                <asp:Panel  ID="Panel8" runat="server" Width="100%" Height="250px"
                    Style="overflow: scroll;" BackColor="#0B3D73" ForeColor="whitesmoke"
                    BorderWidth="2px" BorderColor="black" BorderStyle="Solid" >
                        <div>
                            <p>This panel will reset its position on a postback or page refresh.</p>
                            <hr />
                            <p><%= GetContentFillerText() %></p>
                        </div>
                </asp:Panel>
            </asp:Panel>
        </div>       
        <div style="clear: both;"></div>
        
        <ajaxToolkit:DragPanelExtender ID="DragPanelExtender1" runat="server"
            TargetControlID="Panel6"
            DragHandleID="Panel7" />
    </div>
    <div class="demobottom"></div>

    <asp:Panel ID="Description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            DragPanel Description
        </div>
    </asp:Panel>
    <asp:Panel id="Description_ContentPanel" runat="server" style="overflow:hidden;">
        <p>
            The DragPanel extender allows users to easily add "draggability" to their controls.  The
            DragPanel targets any ASP.NET Panel and takes an additional parameter that signifies the
            control to use as the "drag handle".  Once initialized, the user can freely drag the panel
            around the web page using the drag handle.
        </p>
    </asp:Panel>

    <asp:Panel ID="Properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            DragPanel Properties
        </div>
    </asp:Panel>
    <asp:Panel id="Properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
        <p>
            The control above is initialized with this code:<br />
        </p>
<pre>&lt;ajaxToolkit:DragPanelExtender ID="DPE1" runat="server"
    TargetControlID="Panel3"
    DragHandleID="Panel4" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of a Panel to make draggable.</li>
            <li><strong>DragHandleID</strong> - The ID of a control that will serve as the "drag handle"
                for the panel.  When the user clicks and drags this control, the panel will move.</li>
        </ul>
    </asp:Panel>
    
    <script type="text/javascript">
        // The following snippet works around a problem where FloatingBehavior
        // doesn't allow drops outside the "content area" of the page - where "content
        // area" is a little unusual for our sample web pages due to their use of CSS
        // for layout.
        function setBodyHeightToContentHeight() {
            document.body.style.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)+"px";
        }
        setBodyHeightToContentHeight();
        $addHandler(window, "resize", setBodyHeightToContentHeight);    
    </script>

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