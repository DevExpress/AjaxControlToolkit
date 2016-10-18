using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class MaskedEdit_MaskedEdit : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightControlMarkup(MaskedEditExtender2.ID, codeInfoBlock1);
        MarkupHighlighter.HighlightControlMarkup(MaskedEditValidator2.ID, codeInfoBlock2);
    }
}