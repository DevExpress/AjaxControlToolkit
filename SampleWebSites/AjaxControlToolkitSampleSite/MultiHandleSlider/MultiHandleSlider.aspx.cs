// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.

using System;
using AjaxControlToolkit;

/// <summary>
/// A demonstration of the <see cref="MultiHandleSliderExtender" /> control.
/// </summary>
public partial class MultiHandleSlider_MultiHandleSlider : CommonPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Page.IsPostBack)
        {
            lblUpdateDate.Text = "Changed at: " + DateTime.Now.ToLongTimeString();
            updatePanelOne.Update();
        }
    }
}