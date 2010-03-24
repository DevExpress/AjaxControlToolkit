<%@ Page
    Language="C#"
    CodeFile="5351.aspx.cs"
    Inherits="Patch5351"
    MasterPageFile="~/DefaultTests.master"
    Title="Animation Extender Tests" %>
    

<asp:Content ID="Content" ContentPlaceHolderID="SampleContent" Runat="Server">
    <script type="text/javascript">
        function log(msg) {
            $get("log").innerHTML += msg + "<br/>"
        }
    </script>

    <asp:Panel ID="pnlMenuContainer" runat="server">
    <div>A</div>
    <div>B</div>
    </asp:Panel>

    <asp:AnimationExtender ID="aeMenuOpener" runat="server" TargetControlID="pnlMenuContainer">
        <Animations>
            <OnHoverOver>
                <ScriptAction script="log('OnHoverOver');" />
            </OnHoverOver>
            <OnHoverOut>
                <ScriptAction script="log('OnHoverOut');" />
            </OnHoverOut>            
            <OnMouseOver>
                <ScriptAction script="log('OnMouseOver');" />
            </OnMouseOver>
            <OnMouseOut>
                <ScriptAction script="log('OnMouseOut');" />
            </OnMouseOut>            
        </Animations>
    </asp:AnimationExtender>

    <div id="log"></div>
</asp:Content>
