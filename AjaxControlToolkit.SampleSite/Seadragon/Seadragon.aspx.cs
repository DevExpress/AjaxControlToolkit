using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Seadragon_Seadragon : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        MarkupHighlighter.HighlightControlMarkup(Seadragon.ID, codeInfoBlock, "codeBlock1");
        MarkupHighlighter.HighlightControlMarkup(Seadragon2.ID, codeInfoBlock, "codeBlock2");
    }
}