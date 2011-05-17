// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

public partial class NoBot_NoBot : CommonPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (IsPostBack)
        {
            // Display results view
            MultiView1.SetActiveView(View2);
            NoBotState state;
            Label1.Text = string.Format(
                (NoBot1.IsValid(out state) ?
                    "Congratulations, \"{1} {2}\", you do not appear to be a bot. (Details: {0})" :
                    "Rejected; user appears to be a bot. (Details: {0})"),
                    state.ToString(), TextBox1.Text, TextBox2.Text);
            StringBuilder sb = new StringBuilder();
            foreach (KeyValuePair<DateTime, string> kvp in NoBot.GetCopyOfUserAddressCache())
            {
                sb.AppendFormat("{0}: {1}<br />", kvp.Key.ToString("u"), kvp.Value);
            }
            Label2.Text = sb.ToString();
        }
        else
        {
            // Display input view
            MultiView1.SetActiveView(View1);
        }
    }

    protected void CustomChallengeResponse(object sender, NoBotEventArgs e)
    {
        // This is a sample challenge/response implementation that involves
        // the DOM so as to make the calculation more difficult to thwart.
        // It adds a randomly sized Panel; the client must calculate the area.
        Panel p = new Panel();
        p.ID = "NoBotSamplePanel";
        Random rand = new Random();
        p.Width = rand.Next(300);
        p.Height = rand.Next(200);
        p.Style.Add(HtmlTextWriterStyle.Visibility, "hidden");
        p.Style.Add(HtmlTextWriterStyle.Position, "absolute");
        ((NoBot) sender).Controls.Add(p);
        e.ChallengeScript = string.Format("var e = document.getElementById('{0}'); e.offsetWidth * e.offsetHeight;", p.ClientID);
        e.RequiredResponse = (p.Width.Value * p.Height.Value).ToString();
    }
}