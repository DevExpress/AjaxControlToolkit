using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager {

    [ClientScriptResource("Sys.Extended.UI.TestExtenderBehavior", "TestExtender.static")]
    [TargetControlType(typeof(TextBox))]
    public class TestExtenderStaticControl : ExtenderControlBase {
    }

}