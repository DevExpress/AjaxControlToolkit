// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Web;

public partial class TextBoxWatermark_TextBoxWatermark : CommonPage
{
    /// <summary>
    /// Override Page_Load to populate initial label text
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">argument</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        Button1_Click(null, null);
    }

    /// <summary>
    /// Handle submit button click to populate label
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">argument</param>
    protected void Button1_Click(object sender, EventArgs e)
    {
        string firstName = (("" == TextBox1.Text) ? "[blank]" : TextBox1.Text);
        string lastName = (("" == TextBox2.Text) ? "[blank]" : TextBox2.Text);
        Label1.Text = HttpUtility.HtmlEncode(string.Format("Hello {0} {1}!", firstName, lastName));
    }
}