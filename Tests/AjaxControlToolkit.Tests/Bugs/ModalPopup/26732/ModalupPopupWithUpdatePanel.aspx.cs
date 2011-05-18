using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxTestWebSite
{
    public partial class ModalupPopupWithUpdatePanel : System.Web.UI.Page
    {
        protected void Page_Init(object sender, EventArgs e)
        { 
        
        }
        
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void updateLabel_Click(object sender, EventArgs e)
        {
            label2.Text = "After Postback";
        }

        protected void postbackBtn_Click(object sender, EventArgs e)
        {
            label5.Text = "After Postback";
        }
        protected void Button5_Click(object sender, EventArgs e)
        {
            label4.Text = "After Postback";
        }
    }
}