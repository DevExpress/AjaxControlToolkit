// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;

public partial class NumericUpDown_NumericUpDown : CommonPage
{
    /// <summary>
    /// Handles submit button to update the label
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">argument</param>
    protected void Button1_Click(object sender, EventArgs e)
    {
        Label1.Text = string.Format("Value: <b>{0}</b><br>Month: <b>{1}</b><br>Random Value: <b>{2}</b><br>Value: <b>{3}</b>",
            TextBox1.Text, TextBox2.Text, TextBox3.Text, TextBox4.Text);
    }
}