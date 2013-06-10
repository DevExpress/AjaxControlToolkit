using System;
using System.Text.RegularExpressions;
using System.Web.UI.Design;

namespace AjaxControlToolkit
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes")]
    public class GravatarDesigner : ControlDesigner
    {
        private Gravatar _gravatar = null;

        public override void Initialize(System.ComponentModel.IComponent component)
        {
            _gravatar = component as Gravatar;
            if (_gravatar == null)
                throw new ArgumentException("Component must be a gravatar control", "component");
            base.Initialize(component);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods")]
        public override string GetDesignTimeHtml()
        {
            var rating = _gravatar.Rating == GravatarRating.Default
                             ? "G"
                             : _gravatar.Rating.ToString();

            var gravatarDefaultImageUrl = ViewControl.Page.ClientScript.GetWebResourceUrl(
                this.GetType(), "Gravatar.Images.gravatar-" + rating + ".jpg");
            return string.Format("<div style='width:80px; height:80px;'><img src='{0}'/></div>", gravatarDefaultImageUrl);
        }

        public override bool AllowResize
        {
            get { return false; }
        }

        protected override bool Visible
        {
            get { return true; }
        }

    }
}
