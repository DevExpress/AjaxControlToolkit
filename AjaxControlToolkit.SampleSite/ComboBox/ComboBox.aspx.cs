using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ComboBox_ComboBox : Page {
    protected void Page_Load(object sender, EventArgs e) {
    }

    private static string[] wordListText;
    public string[] GetWordListText() {
        // This is the NATO phonetic alphabet (http://en.wikipedia.org/wiki/NATO_phonetic_alphabet)
        // and was chosen for its size, non-specificity, and presence of multiple words with the same
        // starting letter.
        if(wordListText == null) {
            var tempWordListText = new string[] {
                "Alfa",
                "Alpha",
                "Bravo",
                "Charlie",
                "Delta",
                "Echo",
                "Foxtrot",
                "Golf",
                "Hotel",
                "India",
                "Juliett",
                "Juliet",
                "Kilo",
                "Lima",
                "Mike",
                "November",
                "Oscar",
                "Papa",
                "Quebec",
                "Romeo",
                "Sierra",
                "Tango",
                "Uniform",
                "Victor",
                "Whiskey",
                "X-ray",
                "Xray",
                "Yankee",
                "Zulu",
                "Zero",
                "Nadazero",
                "One",
                "Unaone",
                "Two",
                "Bissotwo",
                "Three",
                "Terrathree",
                "Four",
                "Kartefour",
                "Five",
                "Pantafive",
                "Six",
                "Soxisix",
                "Seven",
                "Setteseven",
                "Eight",
                "Oktoeight",
                "Nine",
                "Novenine"
                };
            Array.Sort(tempWordListText);
            wordListText = tempWordListText;
        }
        return wordListText;
    }

    protected override void OnLoad(EventArgs e) {
        base.OnLoad(e);

        // initialize property-changers
        if(!IsPostBack) {
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

    protected void ComboBox1_SelectedIndexChanged(object sender, EventArgs e) {
        // user has changed selectedvalue of the demo combobox
        FeedbackSelectedIndexChangedLabel.Text = String.Format(FeedbackSelectedIndexChangedLabel.Text, ComboBox1.SelectedItem.Text);
        FeedbackPanel.Visible = true;
        FeedbackSelectedIndexChangedLabel.Visible = true;
    }

    protected void ComboBox1_ItemInserted(object sender, AjaxControlToolkit.ComboBoxItemInsertEventArgs e) {
        // user has inserted a new item into the demo combobox
        FeedbackItemInsertedLabel.Text = String.Format(FeedbackItemInsertedLabel.Text, ComboBox1.SelectedItem.Text);
        FeedbackPanel.Visible = true;
        FeedbackItemInsertedLabel.Visible = true;
    }

    protected void AutoPostBackCheckBox_CheckedChanged(object sender, EventArgs e) {
        // change the demo combobox's autopostback
        ComboBox1.AutoPostBack = (AutoPostBackCheckBox.Checked) ? true : false;
    }

    protected void DropDownStyleRadioButtonList_SelectedIndexChanged(object sender, EventArgs e) {
        // change the demo combobox's dropdownstyle
        ComboBox1.DropDownStyle = (AjaxControlToolkit.ComboBoxStyle)Enum.Parse(
            typeof(AjaxControlToolkit.ComboBoxStyle), DropDownStyleRadioButtonList.SelectedValue);
    }

    protected void AutoCompleteModeRadioButtonList_SelectedIndexChanged(object sender, EventArgs e) {
        // change the demo combobox's autocompletemode
        ComboBox1.AutoCompleteMode = (AjaxControlToolkit.ComboBoxAutoCompleteMode)Enum.Parse(
            typeof(AjaxControlToolkit.ComboBoxAutoCompleteMode), AutoCompleteModeRadioButtonList.SelectedValue);
    }

    protected void CaseSensitiveCheckBox_CheckedChanged(object sender, EventArgs e) {
        // change the demo combobox's casesensitive
        ComboBox1.CaseSensitive = (CaseSensitiveCheckBox.Checked) ? true : false;
    }

    protected void CssClassRadioButtonList_SelectedIndexChanged(object sender, EventArgs e) {
        // change the demo combobox's cssclass
        ComboBox1.CssClass = CssClassRadioButtonList.SelectedValue;
    }

    protected void ItemInsertLocationRadioButtonList_SelectedIndexChanged(object sender, EventArgs e) {
        // change the demo combobox's iteminsertlocation
        ComboBox1.ItemInsertLocation = (AjaxControlToolkit.ComboBoxItemInsertLocation)Enum.Parse(
            typeof(AjaxControlToolkit.ComboBoxItemInsertLocation), ItemInsertLocationRadioButtonList.SelectedValue);
    }

    protected override void OnPreRender(EventArgs e) {
        base.OnPreRender(e);

        // show source markup of demo combobox
        AutoPostBackSourceLabel.Text = ComboBox1.AutoPostBack.ToString();
        DropDownStyleSourceLabel.Text = ComboBox1.DropDownStyle.ToString();
        AutoCompleteModeSourceLabel.Text = ComboBox1.AutoCompleteMode.ToString();
        CaseSensitiveSourceLabel.Text = ComboBox1.CaseSensitive.ToString();
        CssClassSourceLabel.Text = ComboBox1.CssClass;
        ItemInsertLocationSourceLabel.Text = ComboBox1.ItemInsertLocation.ToString();
    }
}