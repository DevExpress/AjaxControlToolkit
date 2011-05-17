// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.

using System;

public partial class HTMLEditor_Editor : CommonPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ContentChangedLabel.Text = "";
        if(!Page.IsPostBack) {
            editor.Content = "Some text Some text Some text Some text<br />Some text Some text Some text Some text<br />Some text Some text Some text Some text<br />Some text Some text Some text Some text<br />Some text Some text Some text Some text<br />Some text Some text Some text Some text";
        }
    }

    public void SaveProfile(object sender, EventArgs e)
    {
    }

    protected void ContentChanged(object sender, EventArgs e)
    {
        ContentChangedLabel.Text = "<span style='color:red'>Content changed</span>";
    }
}