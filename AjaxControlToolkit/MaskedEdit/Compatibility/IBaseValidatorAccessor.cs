using System.Web.UI;

namespace AjaxControlToolkit.MaskedEditValidatorCompatibility {

    internal interface IBaseValidatorAccessor : IWebControlAccessor {
        bool RenderUpLevel { get; }
        void EnsureID();
        string GetControlRenderID(string name);
    }

}
