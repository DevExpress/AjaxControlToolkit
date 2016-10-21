using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Tabs_Tabs : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        CurrentTab.Text = Tabs.ActiveTab.HeaderText;
    }

    [WebMethod]
    [ScriptMethod]
    public static string GetHtml(string contextKey) {
        // A little pause to mimic a latent call
        System.Threading.Thread.Sleep(250);

        var value = (contextKey == "U")
            ? DateTime.UtcNow.ToString()
            : String.Format("{0:" + contextKey + "}", DateTime.Now);
        return String.Format("<span style='font-family:courier new;font-weight:bold;'>{0}</span>", value);
    }

    public void SaveProfile(object sender, EventArgs e) {
    }
}