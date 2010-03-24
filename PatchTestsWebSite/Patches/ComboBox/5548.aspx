<%@ Page 
    Language="C#" 
    MasterPageFile="~/DefaultTests.master" 
    AutoEventWireup="true"
    Inherits="CommonPage" 
    Title="ComboBox Sample" 
    Theme="SampleSiteTheme" %>

<script runat="server">
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);


        // initialize property-changers
        if (!IsPostBack)
        {
            ComboBox1.DataSource = GetWordListText();
            ComboBox1.DataBind();
            AutoPostBackCheckBox.Checked = (ComboBox1.AutoPostBack) ? true : false;
            DropDownStyleRadioButtonList.SelectedValue = ComboBox1.DropDownStyle.ToString();
            AutoCompleteModeRadioButtonList.SelectedValue = ComboBox1.AutoCompleteMode.ToString();
            CaseSensitiveCheckBox.Checked = (ComboBox1.CaseSensitive) ? true : false;
            CssClassRadioButtonList.SelectedValue = ComboBox1.CssClass;
            ItemInsertLocationRadioButtonList.SelectedValue = ComboBox1.ItemInsertLocation.ToString();
        }
    }
    protected void ComboBox1_SelectedIndexChanged(object sender, EventArgs e)
    {
        // user has changed selectedvalue of the demo combobox
        FeedbackSelectedIndexChangedLabel.Text = string.Format(FeedbackSelectedIndexChangedLabel.Text, ComboBox1.SelectedItem.Text);
        FeedbackPanel.Visible = true;
        FeedbackSelectedIndexChangedLabel.Visible = true;
    }
    protected void ComboBox1_ItemInserted(object sender, AjaxControlToolkit.ComboBoxItemInsertEventArgs e)
    {
        // user has inserted a new item into the demo combobox
        FeedbackItemInsertedLabel.Text = string.Format(FeedbackItemInsertedLabel.Text, ComboBox1.SelectedItem.Text);
        FeedbackPanel.Visible = true;
        FeedbackItemInsertedLabel.Visible = true;
    }
    protected void AutoPostBackCheckBox_CheckedChanged(object sender, EventArgs e)
    {
        // change the demo combobox's autopostback
        ComboBox1.AutoPostBack = (AutoPostBackCheckBox.Checked) ? true : false;
    }
    protected void DropDownStyleRadioButtonList_SelectedIndexChanged(object sender, EventArgs e)
    {
        // change the demo combobox's dropdownstyle
        ComboBox1.DropDownStyle = (AjaxControlToolkit.ComboBoxStyle)Enum.Parse(
            typeof(AjaxControlToolkit.ComboBoxStyle), DropDownStyleRadioButtonList.SelectedValue);
    }
    protected void AutoCompleteModeRadioButtonList_SelectedIndexChanged(object sender, EventArgs e)
    {
        // change the demo combobox's autocompletemode
        ComboBox1.AutoCompleteMode = (AjaxControlToolkit.ComboBoxAutoCompleteMode)Enum.Parse(
            typeof(AjaxControlToolkit.ComboBoxAutoCompleteMode), AutoCompleteModeRadioButtonList.SelectedValue);
    }
    protected void CaseSensitiveCheckBox_CheckedChanged(object sender, EventArgs e)
    {
        // change the demo combobox's casesensitive
        ComboBox1.CaseSensitive = (CaseSensitiveCheckBox.Checked) ? true : false;
    }
    protected void CssClassRadioButtonList_SelectedIndexChanged(object sender, EventArgs e)
    {
        // change the demo combobox's cssclass
        ComboBox1.CssClass = CssClassRadioButtonList.SelectedValue;
    }
    protected void ItemInsertLocationRadioButtonList_SelectedIndexChanged(object sender, EventArgs e)
    {
        // change the demo combobox's iteminsertlocation
        ComboBox1.ItemInsertLocation = (AjaxControlToolkit.ComboBoxItemInsertLocation)Enum.Parse(
            typeof(AjaxControlToolkit.ComboBoxItemInsertLocation), ItemInsertLocationRadioButtonList.SelectedValue);
    }
    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);

        // show source markup of demo combobox
        AutoPostBackSourceLabel.Text = ComboBox1.AutoPostBack.ToString();
        DropDownStyleSourceLabel.Text = ComboBox1.DropDownStyle.ToString();
        AutoCompleteModeSourceLabel.Text = ComboBox1.AutoCompleteMode.ToString();
        CaseSensitiveSourceLabel.Text = ComboBox1.CaseSensitive.ToString();
        CssClassSourceLabel.Text = ComboBox1.CssClass;
        ItemInsertLocationSourceLabel.Text = ComboBox1.ItemInsertLocation.ToString();
    }
</script>

<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <div class="demoarea">
        <div class="demoheading">
            ComboBox Demonstration</div>
        <asp:UpdatePanel ID="up1" runat="server">
            <ContentTemplate>
                <div class="comboBoxDemo">
                    <asp:Panel ID="SourceMarkupPanel" runat="server" Style="font-family: Courier New;
                        color: #0000FF;">
                        &lt;<span style="color: #990000;">ajaxToolkit</span>:<span style="color: #990000;">ComboBox</span>
                        <span style="color: #FF0000;">ID</span>=&quot;ComboBox1&quot; <span style="color: #FF0000;">
                            runat</span>=&quot;server&quot;
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
                            ID="ItemInsertLocationSourceLabel" runat="server" Text="{0}" />&quot; <span style="color: #000000;">
                                ...</span> &gt;
                        <br />
                        <br />
                    </asp:Panel>
                    <div>
                        <asp:ComboBox ID="ComboBox1" runat="server" DropDownStyle="DropDownList"
                            AutoCompleteMode="SuggestAppend" CssClass="" OnItemInserted="ComboBox1_ItemInserted"
                            OnSelectedIndexChanged="ComboBox1_SelectedIndexChanged" AppendDataBoundItems="false">
                            <asp:ListItem>Fox</asp:ListItem>
                        </asp:ComboBox>
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
    </div>
</asp:Content>
