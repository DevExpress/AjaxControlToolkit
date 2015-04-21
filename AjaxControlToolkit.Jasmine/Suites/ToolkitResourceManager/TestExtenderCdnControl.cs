using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: WebResource("TestExtender.cdn.stub.js", "text/javascript", CdnPath = "../Scripts/TestExtender.cdn.js")]
[assembly: WebResource("TestExtender.cdn.stub.debug.js", "text/javascript", CdnPath = "../Scripts/TestExtender.cdn.debug.js")]

namespace AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager {

    [ClientScriptResource("Sys.Extended.UI.TestExtenderBehavior", "TestExtender.cdn.stub")]
    [TargetControlType(typeof(TextBox))]
    public class TestExtenderCdnControl : ExtenderControlBase {
    }

}