#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Text.RegularExpressions;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    public class GravatarDesigner : ControlDesigner {
        Gravatar _gravatar = null;

        public override void Initialize(IComponent component) {
            _gravatar = component as Gravatar;
            if(_gravatar == null)
                throw new ArgumentException("Component must be a gravatar control", "component");
            base.Initialize(component);
        }

        public override string GetDesignTimeHtml() {
            var rating = _gravatar.Rating == GravatarRating.Default
                             ? "G"
                             : _gravatar.Rating.ToString();

            var gravatarDefaultImageUrl = ViewControl.Page.ClientScript.GetWebResourceUrl(
                this.GetType(), "Gravatar.Images.gravatar-" + rating + ".jpg");
            return String.Format("<div style='width:80px; height:80px;'><img src='{0}'/></div>", gravatarDefaultImageUrl);
        }

        public override bool AllowResize {
            get { return false; }
        }

        protected override bool Visible {
            get { return true; }
        }
    }

}

#pragma warning restore 1591