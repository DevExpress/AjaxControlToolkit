using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class PopupControl_PopupControl : Page {

    protected void ReminderButton_Click(object sender, EventArgs e) {
        string text;
        try {
            text = String.Format("A reminder would have been created for {0} with the message \"{1}\"",
                DateTime.Parse(DateTextBox.Text).ToLongDateString(), MessageTextBox.Text);
        } catch(FormatException ex) {
            text = String.Format("[Unable to parse \"{0}\": {1}]", DateTextBox.Text, ex.Message);
        }
        Label1.Text = HttpUtility.HtmlEncode(text);
    }

    protected void Calendar1_SelectionChanged(object sender, EventArgs e) {
        // Popup result is the selected date
        PopupControlExtender1.Commit(Calendar1.SelectedDate.ToShortDateString());
    }

    protected void RadioButtonList1_SelectedIndexChanged(object sender, EventArgs e) {
        if(!String.IsNullOrEmpty(RadioButtonList1.SelectedValue)) {
            // Popup result is the selected task
            PopupControlExtender2.Commit(RadioButtonList1.SelectedValue);
        } else {
            // Cancel the popup
            PopupControlExtender2.Cancel();
        }
        // Reset the selected item
        RadioButtonList1.ClearSelection();
    }
}