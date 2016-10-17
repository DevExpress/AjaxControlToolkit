using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class HtmlEditorExtender_HtmlEditorExtenderCustomEvents : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightScriptMarkup("contentChangedScript", codeBlock1);
        MarkupHighlighter.HighlightControlMarkup(txtBox1.ID, codeBlock2);
        MarkupHighlighter.HighlightControlMarkup(htmlEditorExtender1.ID, codeBlock3);
    }
}