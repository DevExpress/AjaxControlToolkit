

using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: WebResource("DropDown.drop-arrow.gif", "image/gif")]
[assembly: WebResource("DropDown.DropDown_resource.css", "text/css", PerformSubstitution=true)]
[assembly: System.Web.UI.WebResource("DropDown.DropDownBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("DropDown.DropDownBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [TargetControlType(typeof(Control))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(HoverExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [ClientCssResource("DropDown.DropDown_resource.css")]
    [ClientScriptResource("Sys.Extended.UI.DropDownBehavior", "DropDown.DropDownBehavior.js")]
    [Designer("AjaxControlToolkit.DropDownDesigner, AjaxControlToolkit")]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(DropDownExtender), "DropDown.DropDown.ico")]
    public class DropDownExtender : DynamicPopulateExtenderControlBase
    {
        [DefaultValue("")]
        [IDReferenceProperty(typeof(Control))]
        [ExtenderControlProperty]
        [ElementReference]
        [ClientPropertyName("dropDownControl")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string DropDownControlID
        {
            get { return (string)(ViewState["DropDownControlID"] ?? string.Empty); }
            set { ViewState["DropDownControlID"] = value; }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBorderColor")]
        public Color HighlightBorderColor
        {
            get { return (Color)(ViewState["HighlightBorderColor"] ?? Color.Empty); }
            set { ViewState["HighlightBorderColor"] = value; }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBackgroundColor")]
        public Color HighlightBackColor
        {
            get { return (Color)(ViewState["HighlightBackColor"] ?? Color.Empty); }
            set { ViewState["HighlightBackColor"] = value; }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowBackgroundColor")]
        public Color DropArrowBackColor
        {
            get { return (Color)(ViewState["DropArrowBackColor"] ?? Color.Empty); }
            set { ViewState["DropArrowBackColor"] = value; }
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowImageUrl")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string DropArrowImageUrl
        {
            get { return (string)(ViewState["DropArrowImageUrl"] ?? String.Empty); }
            set { ViewState["DropArrowImageUrl"] = value; }
        }

        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowWidth")]
        public Unit DropArrowWidth
        {
            get { return (Unit)(ViewState["DropArrowWidth"] ?? Unit.Empty); }
            set { ViewState["DropArrowWidth"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("popup")]
        public string OnClientPopup
        {
            get { return (string)(ViewState["OnClientPopup"] ?? string.Empty); }
            set { ViewState["OnClientPopup"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populating")]
        public string OnClientPopulating
        {
            get { return (string)(ViewState["OnClientPopulating"] ?? string.Empty); }
            set { ViewState["OnClientPopulating"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populated")]
        public string OnClientPopulated
        {
            get { return (string)(ViewState["OnClientPopulated"] ?? string.Empty); }
            set { ViewState["OnClientPopulated"] = value; }
        }

        /// <summary>
        /// OnShow animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow
        {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        private Animation _onShow;

        /// <summary>
        /// OnHide animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide
        {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        private Animation _onHide;

        /// <summary>
        /// If the DynamicControlID was not supplied, use the DropDownControlID instead.
        /// </summary>
        /// <param name="e">EventArgs</param>
        /// <remarks>
        /// This is in place for backward compatability (when DropDownExtender.DynamicControlID
        /// didn't exist and DropDownExtender.DropDownControlID was used instead)
        /// </remarks>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            
            // If the dynamic populate functionality is being used but
            // no target is specified, used the drop down control
            if ((!string.IsNullOrEmpty(DynamicContextKey) || !string.IsNullOrEmpty(DynamicServicePath) || !string.IsNullOrEmpty(DynamicServiceMethod))
                && string.IsNullOrEmpty(DynamicControlID))
            {
                DynamicControlID = DropDownControlID;
            }

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }
}