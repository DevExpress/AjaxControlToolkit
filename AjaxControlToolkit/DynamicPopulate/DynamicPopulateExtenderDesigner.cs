#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    public class DynamicPopulateExtenderDesigner : ExtenderControlBaseDesigner<DynamicPopulateExtender> {

        [PageMethodSignature("Dynamic Populate", "ServicePath", "ServiceMethod")]
        delegate string GetDynamicContent(string contextKey);
    }

}
#pragma warning restore 1591