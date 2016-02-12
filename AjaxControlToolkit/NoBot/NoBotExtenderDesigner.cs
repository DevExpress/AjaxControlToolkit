#pragma warning disable 1591
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    public class NoBotExtenderDesigner : ControlDesigner {
        public NoBotExtenderDesigner() {
        }

        public override string GetDesignTimeHtml() {
            return CreatePlaceHolderDesignTimeHtml();
        }
    }

}

#pragma warning restore 1591