using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26915 {
    public partial class WebForm1 : System.Web.UI.Page {

        protected override void OnInit(EventArgs e) {
            
            btn.Click += new EventHandler(btn_Click);
            
            val.ServerValidate += new ServerValidateEventHandler(val_ServerValidate);

            base.OnInit(e);
        }
        
        protected void Page_Load(object sender, EventArgs e) {
        }

        void val_ServerValidate(object source, ServerValidateEventArgs args) {
            args.IsValid = false;
        }

        void btn_Click(object sender, EventArgs e) {
            
        }
    }
}