﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CollapsiblePanel_CollapsiblePanel : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightMarkup(cpeDemo.ID, codeInfoBlock);
    }
}
