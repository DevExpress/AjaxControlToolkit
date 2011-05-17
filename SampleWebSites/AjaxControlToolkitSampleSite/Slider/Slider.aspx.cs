// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.

using System;

public partial class Slider_Slider : CommonPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ScriptManager1.RegisterAsyncPostBackControl(Slider1);

        if (Page.IsPostBack)
        {
            lblUpdateDate.Text = "Changed at: " + DateTime.Now.ToLongTimeString();
        }
    }
}