


using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using AjaxControlToolkit;

public partial class NoBot : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Prevent IE from caching the page during test runs (which breaks the tests)
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        // Capture the reported NoBot states
        NoBotState state1;
        NoBotState state2;
        if ((NoBot1.IsValid() != NoBot1.IsValid(out state1)) ||
            (NoBot2.IsValid() != NoBot2.IsValid(out state2)))
        {
            throw new Exception("Results of IsValid methods differ.");
        }
        Label1.Text = state1.ToString();
        Label2.Text = state2.ToString();
    }

    protected void NoBot2_GenerateChallengeAndResponse(object sender, NoBotEventArgs e)
    {
        // A simple challenge
        e.ChallengeScript = "'cHaLlEnGe'.toUpperCase()";
        e.RequiredResponse = "CHALLENGE";
    }

    protected void Button2_Click(object sender, EventArgs e)
    {
        AjaxControlToolkit.NoBot.EmptyUserAddressCache();
    }
}
