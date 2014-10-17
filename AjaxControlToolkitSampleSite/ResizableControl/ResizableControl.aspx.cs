using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ResizableControl_ResizableControl : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
    }

    protected void Button2_Click(object sender, EventArgs e) {
        System.Drawing.Size s = ResizableControlExtender1.Size;
        ResizableControlExtender1.Size = new System.Drawing.Size(s.Width / 2, s.Height / 2);
    }
}