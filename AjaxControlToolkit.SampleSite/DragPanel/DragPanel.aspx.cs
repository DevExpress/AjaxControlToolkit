﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class DragPanel_DragPanel : System.Web.UI.Page {

    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightControlMarkup(DragPanelExtender1.ID, codeInfoBlock);
    }
}