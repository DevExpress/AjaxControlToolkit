<%@ Page Title="ComboBox" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ComboBox.aspx.cs" Inherits="ComboBox_ComboBox" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    ComboBox Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel ID="up1" runat="server">
        <ContentTemplate>
            <div class="comboBoxDemo">
                <asp:Panel ID="SourceMarkupPanel" runat="server" Style="font-family: Courier New; color: #0000FF;">
                    &lt;<span style="color: #990000;">ajaxToolkit</span>:<span style="color: #990000;">ComboBox</span>
                    <span style="color: #FF0000;">ID</span>=&quot;ComboBox1&quot; <span style="color: #FF0000;">runat</span>=&quot;server&quot;
                        <br />
                    &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #FF0000;">AutoPostBack</span>=&quot;<asp:Label
                        ID="AutoPostBackSourceLabel" runat="server" Text="{0}" />&quot;
                        <br />
                    &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #FF0000;">DropDownStyle</span>=&quot;<asp:Label
                        ID="DropDownStyleSourceLabel" runat="server" Text="{0}" />&quot;
                        <br />
                    &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #FF0000;">AutoCompleteMode</span>=&quot;<asp:Label
                        ID="AutoCompleteModeSourceLabel" runat="server" Text="{0}" />&quot;
                        <br />
                    &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #FF0000;">CaseSensitive</span>=&quot;<asp:Label
                        ID="CaseSensitiveSourceLabel" runat="server" Text="{0}" />&quot;
                        <br />
                    &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #FF0000;">CssClass</span>=&quot;<asp:Label
                        ID="CssClassSourceLabel" runat="server" Text="{0}" />&quot;
                        <br />
                    &nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #FF0000;">ItemInsertLocation</span>=&quot;<asp:Label
                        ID="ItemInsertLocationSourceLabel" runat="server" Text="{0}" />&quot; <span style="color: #000000;">...</span> &gt;
                        <br />
                    <br />
                </asp:Panel>
                <div>
                    <ajaxToolkit:ComboBox ID="ComboBox1" runat="server" DropDownStyle="DropDownList"
                        AutoCompleteMode="SuggestAppend" CssClass="" OnItemInserted="ComboBox1_ItemInserted"
                        OnSelectedIndexChanged="ComboBox1_SelectedIndexChanged" AppendDataBoundItems="false">
                    </ajaxToolkit:ComboBox>
                    <br />
                    <asp:Button ID="ManualPostBackButton" runat="server" Text="Submit" />
                </div>
                <asp:Panel ID="FeedbackPanel" runat="server" EnableViewState="false" Visible="false"
                    Style="margin: 10px 0 0 0; padding: 3px; font-style: italic; background-color: #FFFF90;">
                    <asp:Label ID="FeedbackSelectedIndexChangedLabel" runat="server" Visible="false">
                            You changed your selection to: <b>{0}</b>
                    </asp:Label>
                    <asp:Label ID="FeedbackItemInsertedLabel" runat="server" Visible="false">
                            You added a new item to the list: <b>{0}</b> 
                    </asp:Label>
                </asp:Panel>
                <div style="padding: 10px 0;">
                    <div>
                        <asp:Label ID="AutoPostBackCheckBoxLabel" runat="server" AssociatedControlID="AutoPostBackCheckBox">
                                AutoPostBack:
                        </asp:Label>
                        <asp:CheckBox ID="AutoPostBackCheckBox" runat="server" AutoPostBack="true" Text=""
                            OnCheckedChanged="AutoPostBackCheckBox_CheckedChanged"></asp:CheckBox>
                    </div>
                    <div>
                        <asp:Label ID="DropDownStyleRadioButtonLabel" runat="server" AssociatedControlID="DropDownStyleRadioButtonList">
                                DropDownStyle:
                        </asp:Label>
                        <asp:RadioButtonList ID="DropDownStyleRadioButtonList" runat="server" AutoPostBack="true"
                            OnSelectedIndexChanged="DropDownStyleRadioButtonList_SelectedIndexChanged" RepeatDirection="Horizontal"
                            RepeatLayout="Flow">
                            <asp:ListItem Value="Simple" Text="Simple&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="DropDown" Text="DropDown&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="DropDownList" Text="DropDownList&nbsp;&nbsp;&nbsp;" />
                        </asp:RadioButtonList>
                    </div>
                    <div>
                        <asp:Label ID="AutoCompleteModeRadioButtonLabel" runat="server" AssociatedControlID="AutoCompleteModeRadioButtonList">
                                AutoCompleteMode:
                        </asp:Label>
                        <asp:RadioButtonList ID="AutoCompleteModeRadioButtonList" runat="server" AutoPostBack="true"
                            OnSelectedIndexChanged="AutoCompleteModeRadioButtonList_SelectedIndexChanged"
                            RepeatDirection="Horizontal" RepeatLayout="Flow">
                            <asp:ListItem Value="None" Text="None&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="Suggest" Text="Suggest&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="Append" Text="Append&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="SuggestAppend" Text="SuggestAppend&nbsp;&nbsp;&nbsp;" />
                        </asp:RadioButtonList>
                    </div>
                    <div>
                        <asp:Label ID="CaseSensitiveCheckBoxLabel" runat="server" AssociatedControlID="CaseSensitiveCheckBox">
                                CaseSensitive:
                        </asp:Label>
                        <asp:CheckBox ID="CaseSensitiveCheckBox" runat="server" AutoPostBack="true" OnCheckedChanged="CaseSensitiveCheckBox_CheckedChanged"
                            Text=""></asp:CheckBox>
                    </div>
                    <div>
                        <asp:Label ID="CssClassRadioButtonListLabel" runat="server" AssociatedControlID="CssClassRadioButtonList">
                                CssClass:
                        </asp:Label>
                        <asp:RadioButtonList ID="CssClassRadioButtonList" runat="server" AutoPostBack="true"
                            OnSelectedIndexChanged="CssClassRadioButtonList_SelectedIndexChanged" RepeatDirection="Horizontal"
                            RepeatLayout="Flow">
                            <asp:ListItem Value="" Text="[Empty String]&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="AjaxToolkitStyle" Text="AjaxControlToolkit&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="AquaStyle" Text="Aqua&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="WindowsStyle" Text="Windows&nbsp;&nbsp;&nbsp;" />
                        </asp:RadioButtonList>
                    </div>
                    <div>
                        <asp:Label ID="ItemInsertLocationRadioButtonListLabel" runat="server" AssociatedControlID="ItemInsertLocationRadioButtonList">
                                ItemInsertLocation:
                        </asp:Label>
                        <asp:RadioButtonList ID="ItemInsertLocationRadioButtonList" runat="server" AutoPostBack="true"
                            OnSelectedIndexChanged="ItemInsertLocationRadioButtonList_SelectedIndexChanged"
                            RepeatDirection="Horizontal" RepeatLayout="Flow">
                            <asp:ListItem Value="Append" Text="Append&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="Prepend" Text="Prepend&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="OrdinalText" Text="OrdinalText&nbsp;&nbsp;&nbsp;" />
                            <asp:ListItem Value="OrdinalValue" Text="OrdinalValue&nbsp;&nbsp;&nbsp;" />
                        </asp:RadioButtonList>
                    </div>
                </div>
            </div>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ComboBox Description</Header>
        <Content>
            <div runat="server" data-control-type="ComboBox" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>ComboBox Properties</Header>
        <Content>
            <div runat="server" data-control-type="ComboBox" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>ComboBox Known Issues</Header>
        <Content>
            <p>
                When ListItemHoverCssClass is specified and the ComboBox list is scrollable, highlighting
            a list item will cause the scrollbar to flicker when using the Internet Explorer
            web browser. To avoid this issue, do not specify the ListItemHoverCssClass property.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>ComboBox Theming</Header>
        <Content>
            You can change the look and feel of the ComboBox using the ComboBox CssClass property.
        The ComboBox has a predefined set of CSS classes that can be overridden. It has
        a default style which is embedded as a WebResource and is a part of the Toolkit
        assembly that has styles set for all the sub-classes. You can find the default styles
        in the Toolkit solution in the <strong>"AjaxControlToolkit\ComboBox\ComboBox.css"</strong>
            file. If your CssClass does not provide values for any of those then it falls back
        to the default value. In the example above the default style is displayed when &quot;[Empty
        String]&quot; is selected as the CssClass. To customize the same the user would
        have to set the CssClass property to the name of the CSS style and define the styles
        for the individual classes so that the various elements in a ComboBox control can
        be styled accordingly. For example, if the CssClass property was set to &quot;CustomComboBoxStyle&quot;,
        this is how the css to style the border and background color would look:
        <pre>
.CustomComboBoxStyle .ajax__combobox_textboxcontainer input {
    background-color: #ADD8E6;
    border: solid 1px Blue;
    border-right: 0px none;
}
.CustomComboBoxStyle .ajax__combobox_buttoncontainer button {
    background-color: #ADD8E6;
    border: solid 1px Blue;
}
        </pre>
            <strong>ComboBox Css classes</strong>
            <br />
            <ul>
                <li><strong>.ajax__combobox_inputcontainer:</strong> A table element that contains and
                positions the ComboBox's button and text box input elements. Child Css classes:
                ajax__combobox_textboxcontainer, ajax__combobox_buttoncontainer.</li>
                <li><strong>.ajax__combobox_textboxcontainer:</strong> The table cell that contains
                the ComboBox's text box input element.</li>
                <li><strong>.ajax__combobox_buttoncontainer:</strong> The table cell that contains the
                ComboBox's button element.</li>
                <li><strong>.ajax__combobox_itemlist:</strong> The ul element that contains the ComboBox's
                list item (li) elements.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>
