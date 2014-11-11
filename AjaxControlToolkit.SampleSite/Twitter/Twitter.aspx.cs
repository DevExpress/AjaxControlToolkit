using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Twitter_Twitter : Page {
    protected void Page_Load(object sender, EventArgs e) {
        if(IsPostBack) {
            ConfigurationManager.AppSettings.Set("act:TwitterAccessToken", TwitterAccessToken.Text);
            ConfigurationManager.AppSettings.Set("act:TwitterAccessTokenSecret", TwitterAccessTokenSecret.Text);
            ConfigurationManager.AppSettings.Set("act:TwitterConsumerKey", TwitterConsumerKey.Text);
            ConfigurationManager.AppSettings.Set("act:TwitterConsumerSecret", TwitterConsumerSecret.Text);
        }

        var oAuthToken = ConfigurationManager.AppSettings["act:TwitterAccessToken"];
        var oAuthTokenSecret = ConfigurationManager.AppSettings["act:TwitterAccessTokenSecret"];
        var oAuthConsumerKey = ConfigurationManager.AppSettings["act:TwitterConsumerKey"];
        var oAuthConsumerSecret = ConfigurationManager.AppSettings["act:TwitterConsumerSecret"];

        var enableControl = !(String.IsNullOrEmpty(oAuthToken)
            || String.IsNullOrEmpty(oAuthTokenSecret)
            || String.IsNullOrEmpty(oAuthConsumerKey)
            || String.IsNullOrEmpty(oAuthConsumerSecret));

        MissingKeysPanel.Visible = !enableControl;
        DemoPanel.Visible = enableControl;
    }
}