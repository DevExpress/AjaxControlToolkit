// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;

public partial class ToggleButton_ToggleButton : CommonPage
{
    /// <summary>
    /// Handles submit button to update the label
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">argument</param>
    protected void Button1_Click(object sender, EventArgs e)
    {
        Label1.Text = string.Format("You indicated that you <b>{0}</b> like ASP.NET and you <b>{1}</b> like ASP.NET AJAX",
            (CheckBox1.Checked ? "do" : "do not"), (CheckBox2.Checked ? "do" : "do not"));
    }
}