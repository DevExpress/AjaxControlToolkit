using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: WebResource("TestExtender.js", "text/javascript")]

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager {

    [ClientScriptResource("Sys.Extended.UI.TestExtenderBehavior", "TestExtender")]
    [TargetControlType(typeof(TextBox))]
    public class TestExtenderControl : ExtenderControlBase {
    }

}