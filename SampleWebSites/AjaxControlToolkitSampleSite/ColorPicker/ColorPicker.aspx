<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" Title="ColorPicker Sample"
    Culture="auto" UICulture="auto" Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnableScriptGlobalization="true"
        EnableScriptLocalization="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            ColorPicker Demonstration</div>
        <div>
        <b>Default color picker: </b>
        <br />
        <asp:TextBox runat="server" ID="Color1" MaxLength="6" AutoCompleteType="None" /><br />
        <ajaxToolkit:ColorPickerExtender ID="defaultCPE" runat="server" OnClientColorSelectionChanged="colorChanged" TargetControlID="Color1" />
        <div style="font-size: 90%">
            <em>(Set the focus to the textbox to show the color picker popup; the popup dismisses automatically
                when you choose a color)</em></div>
        </div>
        <script type="text/javascript">
            function colorChanged(sender) {
                sender.get_element().style.color = "#" + sender.get_selectedColor();
            }
        </script>
        <br />
        <div>
        <b>ColorPicker with an associated button and a sample control:</b><br />
        <asp:TextBox runat="server" ID="Color2" AutoCompleteType="None" MaxLength="6" style="float:left" />
        <asp:ImageButton runat="Server" ID="Image1" style="float:left;margin:0 3px" ImageUrl="~/images/cp_button.png" AlternateText="Click to show color picker" />
        <asp:Panel ID="Sample1" style="width:18px;height:18px;border:1px solid #000;margin:0 3px;float:left" runat="server" />
        <ajaxToolkit:ColorPickerExtender ID="buttonCPE" runat="server"
            TargetControlID="Color2" PopupButtonID="Image1" SampleControlID="Sample1" SelectedColor="33ffcc" />
        <br style="clear:both" />
        <div style="font-size: 90%">
            <em>(Click the image button to show the color picker; enter a valid color value in to the TextBox to 
            have a sample control show the color)</em></div>
        </div>
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            ColorPicker Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            ColorPicker is an ASP.NET AJAX extender that can be attached to any ASP.NET TextBox
            control. It provides client-side color-picking functionality with UI in a popup control. 
            You can interact with the color picker by clicking on a color to select the color. 
            Optionally, a PopupButton control and a SampleControl can be provided which allows 
            customizing ColorPicker's behavior.
        </p>
        <br />
        <p>
            In addition, if a custom color value is entered in a targeted TextBox then the sample control 
            if it's used can demonstrate a custom color even if it's not in a color picker palette.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            ColorPicker Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>The first example of the color picker has been initialized with this code:</p>
        <pre>&lt;ajaxToolkit:ColorPickerExtender runat="server" 
    ID="ColorPickerExtender1"
    TargetControlID="Color1"
    OnClientColorSelectionChanged="colorChanged" /&gt;</pre>
        <p>A <em>colorChanged</em> JavaScript function has been defined as following:</p>
        <pre>function colorChanged(sender) {
  sender.get_element().style.color = 
       "#" + sender.get_selectedColor();
}</pre>
        <p>
            The color picker associated with a button has been initialized with this code. The properties
            in <em>italic</em> are optional:
        </p>
        <pre>&lt;ajaxToolkit:ColorPickerExtender runat="server"
    TargetControlID="Color2"  
    <em>PopupButtonID</em>="Image1"
    <em>SampleControlID</em>="Sample1"
    <em>SelectedColor</em>="33ffcc" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the TextBox to extend with the color picker.</li>
            <li><strong>PopupButtonID</strong> - The ID of a control to show the ColorPicker popup
                when clicked. If this value is not set, the color picker will pop up when the textbox
                receives focus.</li>
            <li><strong>SampleControlID</strong> - The ID of a control to show the ColorPicker's selected color. 
                If this value is set and the color picker popup is open the background color of the sample control 
                will sample the hovered color. If this value is not set, the selected color is not shown.</li>
            <li><strong>PopupPosition</strong> - Indicates where the color picker popup should appear 
                at the BottomLeft(default), BottomRight, TopLeft, TopRight, Left or Right of the TextBox.</li>
            <li><strong>SelectedColor</strong> - Indicates the color value the ColorPicker extender is 
                initialized with.</li>
            <li><strong>OnClientColorSelectionChanged</strong> - A client JavaScript function that will be called
                when the <strong>colorSelectionChanged</strong> event is raised.</li>
        </ul>
    </asp:Panel>
    <asp:Panel runat="server" ID="CalendarCSS_HeaderPanel" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="CalendarCSS_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            ColorPicker Theming
        </div>
    </asp:Panel>
    <asp:Panel runat="server" ID="CalendarCSS_ContentPanel" Style="overflow: hidden;"
        Height="0px">
        It is not supported yet but will be available soon via the ColorPicker CssClass property.
        ColorPicker has a predefined set of CSS classes that can be overridden. It has a default
        style which is embedded as a WebResource and is a part of the Toolkit assembly that
        has styles set for all the sub-classes. You can find them in the Toolkit solution,
        in the <strong>"AjaxControlToolkit\ColorPicker\ColorPicker.css"</strong> file. If your
        CssClass does not provide values for any of those then it falls back to the default
        value. To customize the same the user would have to set the CssClass property to
        the name of the CSS style and define the styles for the individual classes so that
        the various elements in a ColorPicker control can be styled accordingly.
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeCalendarCSS" runat="Server" TargetControlID="CalendarCSS_ContentPanel"
        ExpandControlID="CalendarCSS_HeaderPanel" CollapseControlID="CalendarCSS_HeaderPanel"
        Collapsed="True" ImageControlID="CalendarCSS_ToggleImage" />
</asp:Content>
