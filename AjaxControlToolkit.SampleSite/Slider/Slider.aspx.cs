using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Slider_Slider : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightControlMarkup(SliderExtender1.ID, codeInfoBlock, "codeBlock1");
        MarkupHighlighter.HighlightControlMarkup(SliderExtender2.ID, codeInfoBlock, "codeBlock2");
    }
}