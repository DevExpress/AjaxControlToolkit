// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.

using System;

public partial class Tabs_Tabs : CommonPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        CurrentTab.Text = Tabs.ActiveTab.HeaderText;
    }

    public void SaveProfile(object sender, EventArgs e)
    {
    }
}