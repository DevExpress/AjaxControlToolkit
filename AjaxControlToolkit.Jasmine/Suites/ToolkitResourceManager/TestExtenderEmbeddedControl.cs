using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: WebResource("TestExtender.embedded.js", "text/javascript")]
[assembly: WebResource("TestExtender.embedded.debug.js", "text/javascript")]

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager {

    [ClientScriptResource("Sys.Extended.UI.TestExtenderBehavior", "TestExtender.embedded")]
    [TargetControlType(typeof(TextBox))]
    public class TestExtenderEmbeddedControl : ExtenderControlBase {
    }

}