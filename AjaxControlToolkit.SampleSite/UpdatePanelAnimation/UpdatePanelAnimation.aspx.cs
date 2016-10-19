using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class UpdatePanelAnimation_UpdatePanelAnimation : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightControlMarkup(upae.ID, codeInfoBlock);
    }

    protected void btnUpdate_Click(object sender, EventArgs e) {
        lblUpdate.Text = DateTime.Now.ToString();
    }
}
