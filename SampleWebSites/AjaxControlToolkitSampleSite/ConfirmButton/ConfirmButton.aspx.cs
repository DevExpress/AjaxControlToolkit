// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Web.UI;

public partial class ConfirmButton_ConfirmButton : CommonPage
{
    /// <summary>
    /// Handle the click of either control
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">arguments</param>
    protected void Button_Click(object sender, EventArgs e)
    {
        Label1.Text = "You clicked the " + ((Control) sender).ID + " at " + DateTime.Now.ToLongTimeString() + ".";
    }
}