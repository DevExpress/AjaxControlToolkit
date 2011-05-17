// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Threading;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

public partial class Rating_Rating : CommonPage
{
    /// <summary>
    /// Set the alignment of the stars in the rating control
    /// </summary>
    /// <param name="e">argument</param>
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        ThaiRating.RatingAlign = (lstAlign.SelectedIndex == 1) ?
                Orientation.Vertical :
                Orientation.Horizontal;
        ThaiRating.RatingDirection = (lstDirection.SelectedIndex == 1) ?
                RatingDirection.RightToLeftBottomToTop :
                RatingDirection.LeftToRightTopToBottom;
    }

    /// <summary>
    /// Updates the label with how spicy the user likes their Thai food
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">argument</param>
    protected void Submit_Click(object sender, EventArgs e)
    {
        string howSpicy = "[unknown]";
        switch (ThaiRating.CurrentRating)
        {
            case 1 :
                howSpicy = "bland";
                break;
            case 2 :
                howSpicy = "mild";
                break;
            case 3 :
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

    /// <summary>
    /// Run custom code when the user rates something and then return a custom string
    /// to the JavaScript client
    /// </summary>
    /// <param name="sender">Rating control</param>
    /// <param name="e">RatingEventArgs</param>
    protected void ThaiRating_Changed(object sender, RatingEventArgs e)
    {
        Thread.Sleep(400);        
        e.CallbackResult = "Update done. Value = " + e.Value + " Tag = " + e.Tag;
    }
}