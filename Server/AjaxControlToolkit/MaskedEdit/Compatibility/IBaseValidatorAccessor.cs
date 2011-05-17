namespace AjaxControlToolkit.MaskedEditValidatorCompatibility
{
    using System.Web.UI;

    internal interface IBaseValidatorAccessor : IWebControlAccessor {
        bool RenderUpLevel {
            get;
        }
        void EnsureID();
        string GetControlRenderID(string name);
    }
}
