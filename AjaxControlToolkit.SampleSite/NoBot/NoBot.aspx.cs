using AjaxControlToolkit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class NoBot_NoBot : Page {

    protected void Page_Load(object sender, EventArgs e) {
        if(!IsPostBack) {
            // Display input view
            MultiView1.SetActiveView(View1);
            return;
        }
        // Display results view
        MultiView1.SetActiveView(View2);
        NoBotState state;
        Label1.Text = String.Format(
            (NoBot1.IsValid(out state)
                ? "Congratulations, \"{1} {2}\", you do not appear to be a bot. (Details: {0})"
                : "Rejected; user appears to be a bot. (Details: {0})"),
            state.ToString(), TextBox1.Text, TextBox2.Text);

        var sb = new StringBuilder();
        foreach(var kvp in NoBot.GetCopyOfUserAddressCache())
            sb.AppendFormat("{0}: {1}<br />", kvp.Key.ToString("u"), kvp.Value);

        Label2.Text = sb.ToString();
    }

    protected void CustomChallengeResponse(object sender, NoBotEventArgs e) {
        // This is a sample challenge/response implementation that involves
        // the DOM so as to make the calculation more difficult to thwart.
        // It adds a randomly sized Panel; the client must calculate the area.
        var p = new Panel();
        p.ID = "NoBotSamplePanel";
        var rand = new Random();
        p.Width = rand.Next(300);
        p.Height = rand.Next(200);
        p.Style.Add(HtmlTextWriterStyle.Visibility, "hidden");
        p.Style.Add(HtmlTextWriterStyle.Position, "absolute");
        ((NoBot)sender).Controls.Add(p);
        e.ChallengeScript = string.Format("var e = document.getElementById('{0}'); e.offsetWidth * e.offsetHeight;", p.ClientID);
        e.RequiredResponse = (p.Width.Value * p.Height.Value).ToString();
    }
}