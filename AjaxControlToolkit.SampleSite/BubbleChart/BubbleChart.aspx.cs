﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class BubbleChart_BubbleChart : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightControlMarkup(BubbleChart1.ID, codeInfoBlock);
    }
}