using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing;
using System.Web.UI.WebControls;
using System.Web;

[assembly: WebResource("Gravatar.Images.gravatar-anonymous.jpg", "img/jpg")]
[assembly: WebResource("Gravatar.Images.gravatar-G.jpg", "img/jpg")]
[assembly: WebResource("Gravatar.Images.gravatar-PG.jpg", "img/jpg")]
[assembly: WebResource("Gravatar.Images.gravatar-R.jpg", "img/jpg")]
[assembly: WebResource("Gravatar.Images.gravatar-X.jpg", "img/jpg")]

namespace AjaxControlToolkit
{
    [Designer(typeof(GravatarDesigner))]
    [ToolboxData("<{0}:Gravatar runat=\"server\"></{0}:Gravatar>")]
    [RequiredScript(typeof(ScriptControlBase), 1)]
    [RequiredScript(typeof(CommonToolkitScripts), 2)]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(Gravatar), "Gravatar.Gravatar.ico")]
    public class Gravatar : WebControl
    {

        #region Constructor
        public Gravatar()
            : base(HtmlTextWriterTag.Img)
        { 
        }

        #endregion

        #region Properties

        /// <summary>
        /// The email account, that is used to access gravatar 
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Account email.")]
        [ClientPropertyName("email")]
        public string Email
        {
            get;
            set;
        }

        /// <summary>
        /// The size of the image, that will be loaded from gravatar 
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Image size.")]
        [ClientPropertyName("size")]
        public int? Size
        {
            get;
            set;
        }

        /// <summary>
        /// The image which appears when a Gravatar is not available or when
        /// a Gravatar does not meet the Image Rating requirements.
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Image, that will be shown by default.")]
        [ClientPropertyName("defaultImage")]        
        public string DefaultImage
        {
            get;
            set;
        }

        /// <summary>
        /// The pre-defined behavior, when a Gravatar is not available or when
        /// a Gravatar does not meet the Image Rating requirements.
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Behavior, that will be by default.")]
        [ClientPropertyName("defaultImage")]
        public GravatarDefaultImageBehavior DefaultImageBehavior
        {
            get;
            set;
        }

        /// <summary>
        /// Rating of the image, that can be displayed for the current control
        /// </summary>
        [Category("Behavior")]
        [ExtenderControlProperty]
        [Description("Image rating.")]
        [ClientPropertyName("rating")]
        public GravatarRating Rating
        {
            get;
            set;
        }

        #endregion

        #region Methods
        /// <summary>
        /// This method renders 'src' attribute
        /// </summary>
        protected override void AddAttributesToRender(HtmlTextWriter writer)
        {
            base.AddAttributesToRender(writer);
            writer.AddAttribute(HtmlTextWriterAttribute.Src,GetUrl(Email,Size,DefaultImage,Rating));
        }

        private string GetUrl(string email, int? size, string defaultImage, GravatarRating rating)
        {
            StringBuilder url = new StringBuilder("http://www.gravatar.com/avatar/");
            url.Append(GetHash(Email));

            if (size == null) size = 80;
            url.Append("?s=");
            url.Append(size);
            
            if (!String.IsNullOrEmpty(defaultImage))
            {
                url.Append("&d=");
                url.Append(defaultImage);
            }
            else if(DefaultImageBehavior != GravatarDefaultImageBehavior.Default)
            {
                var behaviorName = DefaultImageBehavior.ToString().ToLower();
                switch (DefaultImageBehavior) {
                    case GravatarDefaultImageBehavior.MysteryMan:
                        behaviorName = "mm";
                        break;
                }

                url.Append("&d=" + behaviorName);
            }

            if (rating != GravatarRating.Default)
            {
                url.Append("&r=");
                url.Append(rating.ToString().ToLowerInvariant());
            }

            return url.ToString();
        }

        private string GetHash(string Email)
        {
            Email = Email.ToLower();
            System.Security.Cryptography.MD5CryptoServiceProvider Md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
            byte[] BytesToHash = System.Text.Encoding.ASCII.GetBytes(Email);
            BytesToHash = Md5.ComputeHash(BytesToHash);
            string Result = "";
            foreach (byte b in BytesToHash)
            {
                Result = (Result + b.ToString("x2"));
            }
            return Result;
        }
        #endregion
    }
}
