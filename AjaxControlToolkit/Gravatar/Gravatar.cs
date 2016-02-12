#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The Gravatar control is an ASP.NET AJAX Control Toolkit control that enables you to use gravatar images on your web forms.
    /// Gravatar is a Globally Recognized Avatar provided by Gravatar.com. 
    /// </summary>
    [Designer(typeof(GravatarDesigner))]
    [ToolboxData("<{0}:Gravatar runat=\"server\"></{0}:Gravatar>")]
    [RequiredScript(typeof(ScriptControlBase), 1)]
    [RequiredScript(typeof(CommonToolkitScripts), 2)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.GravatarName + Constants.IconPostfix)]
    public class Gravatar : WebControl {
        
        public Gravatar() : base(HtmlTextWriterTag.Img) {
        }

        /// <summary>
        /// An email that is associated with an account at Gravatar.com.
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Account email.")]
        [ClientPropertyName("email")]
        public string Email {
            get;
            set;
        }

        /// <summary>
        /// The requested size of an image that the gravatar needs to render (both width and height).
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Image size.")]
        [ClientPropertyName("size")]
        public int? Size {
            get;
            set;
        }

        /// <summary>
        ///  An image Url that will be diplayed if a gravatar image can't be displayed because of inacceptable rating or an email account is not associated with the gravatar.
        ///  It must be an absolute URL. 
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Image, that will be shown by default.")]
        [ClientPropertyName("defaultImage")]
        public string DefaultImage {
            get;
            set;
        }

        /// <summary>
        /// An image displayed when the gravatar is not associated with an email account.
        /// Possible values are Identicon, MonsterId, MysteryMan, Retro, Wavatar. 
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Behavior, that will be by default.")]
        [ClientPropertyName("defaultImage")]
        public GravatarDefaultImageBehavior DefaultImageBehavior {
            get;
            set;
        }

        /// <summary>
        ///  Acceptable rating of an image to display.
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Image rating.")]
        [ClientPropertyName("rating")]
        public GravatarRating Rating {
            get;
            set;
        }

        // This method renders 'src' attribute
        protected override void AddAttributesToRender(HtmlTextWriter writer) {
            base.AddAttributesToRender(writer);
            writer.AddAttribute(HtmlTextWriterAttribute.Src, GetUrl(Email, Size, DefaultImage, Rating));
        }

        string GetUrl(string email, int? size, string defaultImage, GravatarRating rating) {
            var url = new StringBuilder("http://www.gravatar.com/avatar/");
            url.Append(GetHash(Email));

            if(size == null) size = 80;
            url.Append("?s=");
            url.Append(size);

            if(!String.IsNullOrEmpty(defaultImage)) {
                url.Append("&d=");
                url.Append(defaultImage);
            }
            else if(DefaultImageBehavior != GravatarDefaultImageBehavior.Default) {
                var behaviorName = DefaultImageBehavior.ToString().ToLower();
                switch(DefaultImageBehavior) {
                    case GravatarDefaultImageBehavior.MysteryMan:
                        behaviorName = "mm";
                        break;
                }

                url.Append("&d=" + behaviorName);
            }

            if(rating != GravatarRating.Default) {
                url.Append("&r=");
                url.Append(rating.ToString().ToLowerInvariant());
            }

            return url.ToString();
        }

        string GetHash(string Email) {
            Email = Email.ToLower();
            var Md5 = new MD5CryptoServiceProvider();

            var bytesToHash = System.Text.Encoding.ASCII.GetBytes(Email);
            bytesToHash = Md5.ComputeHash(bytesToHash);

            var result = String.Empty;
            foreach(var b in bytesToHash) {
                result = (result + b.ToString("x2"));
            }
            return result;
        }
    }

}

#pragma warning restore 1591