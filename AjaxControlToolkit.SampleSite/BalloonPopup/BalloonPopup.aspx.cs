﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class BaloonPopup_BaloonPopup : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        MarkupHighlighter.HighlightMarkup(PopupControlExtender2.ID, codeInfoBlock);
    }
}