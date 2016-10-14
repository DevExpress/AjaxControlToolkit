using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class DropDown_DropDown : Page {

    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightControlMarkup(DDE.ID, codeInfoBlock);
    }

    protected void OnSelect(object sender, EventArgs e) {
        lblSelection.Text = "You selected <b>" + ((LinkButton)sender).Text + "</b>.";
    }
}