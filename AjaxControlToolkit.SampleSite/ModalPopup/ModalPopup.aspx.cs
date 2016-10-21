using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ModalPopup_ModalPopup : Page {
    protected void Page_Load(object sender, EventArgs e) {
    }

    protected void showModalPopupServerOperatorButton_Click(object sender, EventArgs e) {
        this.programmaticModalPopup.Show();
    }
    protected void hideModalPopupViaServer_Click(object sender, EventArgs e) {
        this.programmaticModalPopup.Hide();
    }
}