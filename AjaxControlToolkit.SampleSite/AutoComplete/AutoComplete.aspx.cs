﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class AutoComplete_AutoComplete : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightControlMarkup(autoComplete1.ID, codeInfoBlock);
    }
}