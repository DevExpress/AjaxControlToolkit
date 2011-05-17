// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Web;

public partial class PopupControl_PopupControl : CommonPage
{
    /// <summary>
    /// Handler for the "add reminder" button
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">arguments</param>
    protected void ReminderButton_Click(object sender, EventArgs e)
    {
        string text;
        try
        {
            text = string.Format("A reminder would have been created for {0} with the message \"{1}\"",
                DateTime.Parse(DateTextBox.Text).ToLongDateString(), MessageTextBox.Text);
        }
        catch (FormatException ex)
        {
            text = string.Format("[Unable to parse \"{0}\": {1}]", DateTextBox.Text, ex.Message);
        }
        Label1.Text = HttpUtility.HtmlEncode(text);
    }

    /// <summary>
    /// Handler for calendar changes
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">arguments</param>
    protected void Calendar1_SelectionChanged(object sender, EventArgs e)
    {
        // Popup result is the selected date
        PopupControlExtender1.Commit(Calendar1.SelectedDate.ToShortDateString());
    }

    /// <summary>
    /// Handler for radio button changes
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">arguments</param>
    protected void RadioButtonList1_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(RadioButtonList1.SelectedValue))
        {
            // Popup result is the selected task
            PopupControlExtender2.Commit(RadioButtonList1.SelectedValue);
        }
        else
        {
            // Cancel the popup
            PopupControlExtender2.Cancel();
        }
        // Reset the selected item
        RadioButtonList1.ClearSelection();
    }
}