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
            <p>
                ComboBox is an ASP.NET AJAX control that, like the 
                <a id="A1" href="~/AutoComplete/AutoComplete.aspx" runat="server">AutoCompleteExtender</a>,
                combines the flexibility of a TextBox with a list of options that users are able to choose from. It borrows many of its
                properties, behaviors, and naming conventions from the 
                <a href="http://msdn.microsoft.com/en-us/library/system.windows.forms.combobox.aspx" target="_blank">Windows Forms ComboBox control
                </a>, and is derived from the same base class as the ListBox, BulletedList, and DropDownList web controls. In
                fact, a ComboBox is best described as a DropDownList that can be typed directly
                into like a TextBox.
            </p>
            <br />
            <p>
                Working with a ComboBox in code is also a lot like working with a DropDownList.
                It has all of the same properties and events as a DropDownList, with a few additional
                ComboBox-specific properties and events. Firstly, it can be configured to either
                prevent or allow user-typed text that does not match an item in the list. When user-typed
                text does match an item in the list, the ComboBox can also be configured to auto-complete
                the text based on the first matched item in the list, to show the list and highlight
                the first matched item, or to do both simultaneously. When user-typed text does
                not match an item in the list, the ComboBox raises ItemInserting and ItemInserted
                events which can be handled during postback. Other than these special behaviors,
                the ComboBox behaves essentially like a DropDownList.
            </p>
            <br />
            The ComboBox is intended as a supplement to, rather than a replacement for, the
            AutoCompleteExtender. Though there are many scenarios where either could be used
            to satisfy the same user interface requirements, there are scenarios where one control
            could offer particular advantages or disadvantages compared to the other:
        <ul>
            <li><b>Data Binding</b> - The ComboBox can bind to data source controls like SqlDataSource
                and ObjectDataSource, and to runtime objects that implement IListSource, IEnumerable,
                or IDataSource. Like the DropDownList, the ComboBox also has an Items collection
                that can be manipulated declaratively and/or programmatically. The AutoCompleteExtender
                can only get its item list from a web service or page method. When it is possible
                and more convenient to bind to a data source control, runtime object, or declared
                item list, the ComboBox may be a better choice than the AutoCompleteExtender.</li>
            <li><b>Restricting User-Typed Text</b> - Another feature of the ComboBox is that it
                can restrict input so that an item in the list is always selected after a postback
                (as long as the Items collection is not empty). The AutoCompleteExtender allows
                users to type anything into the TextBox being extended, even if the typed text doesn&#39;t
                match any options returned by the extender&#39;s ServiceMethod. A ComboBox may be
                a better fit for user interfaces which require a predetermined item be selected
                from the list (like a foreign key input).</li>
            <li><b>Composite Items</b> - Items in a ComboBox, like items in a DropDownList, have
                both Text and Value properties. The only user input value offered by the AutoCompleteExtender
                is the Text property of the TextBox being extended. If the items in your list can
                be modeled with different Text and Value properties, the ComboBox may provide a
                better match for the data items being listed (again, foreign keys can be a good
                example of this).</li>
            <li><b>Long Item Lists / Multiple Input Controls</b> - All of the items in a ComboBox's
                list will be rendered to the web page it exists in. The AutoCompleteExtender, on
                the other hand, retrieves items from its ServiceMethod after the page is rendered.
                When your ComboBox contains a rather long list of items, or when you have a relatively
                large number of ComboBoxes on the same page (or within the same UpdatePanel), load
                times could be slowed down significantly. When ComboBoxes perform slowly because
                of the amount of markup they must render to the browser, an AutoCompleteExtender
                can be used instead to increase performance. </li>
            <li><b>Partial Auto-Completion</b> - The auto-complete feature of the ComboBox will
                only match items that start with the first user-typed character. An AutoCompleteExtender's
                ServiceMethod, on the other hand, can be configured to match items where the user-typed
                text lies somewhere after the first character in the item. A ComboBox cannot be
                used in application scenarios that require items to be &quot;partially matched&quot;
                like this. </li>
            <li><b>Multiple Item Selection</b> - The ComboBox, like the DropDownList, will only
                allow one item to be selected at a time. The AutoCompleteExtender can be configured
                to allow users to select multiple items simultaneously (using the AutoCompleteExtender's
                DelimiterCharacters property), like a ListBox or CheckBoxList. When users must have
                the ability to submit multiple items in a single postback, the AutoCompleteExtender
                should be used instead of the ComboBox.</li>
        </ul>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>ComboBox Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties
            are optional:
            </p>
            <pre>&lt;ajaxToolkit:ComboBox ID="ComboBox1" runat="server" 
    <em>DropDownStyle</em>="DropDown" 
    <em>AutoCompleteMode</em>="None"
    <em>CaseSensitive</em>="false"
    <em>RenderMode</em>="Inline"
    <em>ItemInsertLocation</em>="Append"
    <em>ListItemHoverCssClass</em>="ComboBoxListItemHover"
      <em>&lt;asp:ListItem&gt;...&lt;/asp:ListIem&gt;</em>
      ...
&lt;/ajaxToolkit:ComboBox&gt;</pre>
            <ul>
                <li><strong><em>DropDownStyle</em></strong> - Determines whether the user is allowed
                to enter text that does not match an item in the list, and whether the list is always
                displayed. If &quot;DropDownList&quot; is specified, users are not allowed to enter
                text that does not match an item in the list. When &quot;DropDown&quot; (the default
                value) is specified, any text is allowed. If &quot;Simple&quot; is specified, any
                text is allowed and the list is always displayed regardless of the AutoCompleteMode
                property value.</li>
                <li><strong><em>AutoCompleteMode</em></strong> - Determines how the ComboBox automatically
                completes the text that is typed into it. When "Suggest" is specified, the ComboBox
                will show the list, highlight the first matched item, and if necessary, scroll the
                list to show the highlighted item. If "Append" is specified, the ComboBox will append
                the remainder of the first matched item to the user-typed text and highlight the
                appended text. When "SuggestAppend" is specified, both of the above behaviors are
                applied. If "None" (the default value) is specified, the ComboBox's auto-complete
                behaviors are disabled.</li>
                <li><strong><em>CaseSensitive</em></strong> - Specifies whether user-typed text is matched
                to items in the list in a case-sensitive manner. The default is &quot;false&quot;.</li>
                <li><strong><em>RenderMode</em></strong> - Specifies whether the ComboBox is rendered
                as an &quot;Inline&quot; or &quot;Block&quot; level HTML element. The default is
                &quot;Inline&quot;.</li>
                <li><strong><em>ItemInsertLocation</em></strong> - Determines whether to &quot;Append&quot;
                or &quot;Prepend&quot; new items when they are inserted into the list, or whether
                to insert them in an &quot;Ordinal&quot; manner (alphabetically) based on the item
                Text or Value. The default is &quot;Append&quot;.</li>
                <li><strong><em>ListItemHoverCssClass</em></strong> - When specified, replaces the default
                styles applied to highlighted items in the list with a custom css class.</li>
                <li><strong><em>ListItem</em></strong> - One or more child controls used to declare
                items that will be added to the ComboBox list. When bound to a data source, all
                declared ListItems will be removed unless the AppendDataBoundItems property is set
                to &quot;true&quot;. </li>
            </ul>
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
