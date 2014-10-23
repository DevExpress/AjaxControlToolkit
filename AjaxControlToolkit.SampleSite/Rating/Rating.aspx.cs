using AjaxControlToolkit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Rating_Rating : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        ThaiRating.RatingAlign = (lstAlign.SelectedIndex == 1)
            ? Orientation.Vertical
            : Orientation.Horizontal;

        ThaiRating.RatingDirection = (lstDirection.SelectedIndex == 1)
            ? RatingDirection.RightToLeftBottomToTop
            : RatingDirection.LeftToRightTopToBottom;
    }

    protected void Submit_Click(object sender, EventArgs e) {
        var howSpicy = "[unknown]";
        switch(ThaiRating.CurrentRating) {
            case 1:
                howSpicy = "bland";
                break;
            case 2:
                howSpicy = "mild";
                break;
            case 3:
                howSpicy = "spicy";
                break;
            case 4:
                howSpicy = "scorching hot";
                break;
            case 5:
                howSpicy = "tongue melting";
                break;
        }
        lblResponse.Text = "You prefer Thai food that is <b>" + howSpicy + "</b>.";
    }

    protected void ThaiRating_Changed(object sender, RatingEventArgs e) {
        Thread.Sleep(400);
        e.CallbackResult = "Update done. Value = " + e.Value + " Tag = " + e.Tag;
    }
}