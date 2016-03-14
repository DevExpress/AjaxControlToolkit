#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// DropDown is an ASP.NET AJAX extender that can be attached almost to any ASP.NET control to provide a SharePoint-style drop-down menu.
    /// </summary>
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(HoverExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [ClientCssResource(Constants.DropDownName)]
    [ClientScriptResource("Sys.Extended.UI.DropDownBehavior", Constants.DropDownName)]
    [Designer(typeof(DropDownExtenderDesigner))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.DropDownName + Constants.IconPostfix)]
    public class DropDownExtender : DynamicPopulateExtenderControlBase {
        /// <summary>
        /// A ID of a control that will be displayed as a dropdown.	
        /// </summary>
        [DefaultValue("")]
        [IDReferenceProperty(typeof(Control))]
        [ExtenderControlProperty]
        [ElementReference]
        [ClientPropertyName("dropDownControl")]
        public string DropDownControlID {
            get { return (string)(ViewState["DropDownControlID"] ?? String.Empty); }
            set { ViewState["DropDownControlID"] = value; }
        }

        /// <summary>
        /// Highlight border color.
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBorderColor")]
        public Color HighlightBorderColor {
            get { return (Color)(ViewState["HighlightBorderColor"] ?? Color.Empty); }
            set { ViewState["HighlightBorderColor"] = value; }
        }

        /// <summary>
        /// Highlight background color.
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBackgroundColor")]
        public Color HighlightBackColor {
            get { return (Color)(ViewState["HighlightBackColor"] ?? Color.Empty); }
            set { ViewState["HighlightBackColor"] = value; }
        }

        /// <summary>
        /// An arrow's background color.
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowBackgroundColor")]
        public Color DropArrowBackColor {
            get { return (Color)(ViewState["DropArrowBackColor"] ?? Color.Empty); }
            set { ViewState["DropArrowBackColor"] = value; }
        }

        /// <summary>
        /// An arrow's image URL.
        /// </summary>
        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowImageUrl")]
        public string DropArrowImageUrl {
            get { return (string)(ViewState["DropArrowImageUrl"] ?? String.Empty); }
            set { ViewState["DropArrowImageUrl"] = value; }
        }

        /// <summary>
        /// Arrow width.
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowWidth")]
        public Unit DropArrowWidth {
            get { return (Unit)(ViewState["DropArrowWidth"] ?? Unit.Empty); }
            set { ViewState["DropArrowWidth"] = value; }
        }

        /// <summary>
        /// The popup event
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("popup")]
        public string OnClientPopup {
            get { return (string)(ViewState["OnClientPopup"] ?? String.Empty); }
            set { ViewState["OnClientPopup"] = value; }
        }

        /// <summary>
        /// The populating event
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populating")]
        public string OnClientPopulating {
            get { return (string)(ViewState["OnClientPopulating"] ?? String.Empty); }
            set { ViewState["OnClientPopulating"] = value; }
        }

        /// <summary>
        /// The populated event
        /// </summary>
        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populated")]
        public string OnClientPopulated {
            get { return (string)(ViewState["OnClientPopulated"] ?? String.Empty); }
            set { ViewState["OnClientPopulated"] = value; }
        }

        /// <summary>
        /// OnShow animation will be played each time the dropdown is displayed.
        /// The dropdown will be positioned correctly but hidden.
        /// Animation can be used to display the dropdown with other visual effects.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        Animation _onShow;

        /// <summary>
        /// OnHide animation will be played each time the dropdown is hidden.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        Animation _onHide;

        // If the DynamicControlID was not supplied, use the DropDownControlID instead.
        // This is in place for backward compatability (when DropDownExtender.DynamicControlID
        // didn't exist and DropDownExtender.DropDownControlID was used instead)
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            // If the dynamic populate functionality is being used but
            // no target is specified, used the drop down control
            if((!String.IsNullOrEmpty(DynamicContextKey) 
                || !String.IsNullOrEmpty(DynamicServicePath) 
                || !String.IsNullOrEmpty(DynamicServiceMethod))
                && String.IsNullOrEmpty(DynamicControlID))
                DynamicControlID = DropDownControlID;

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }

}
#pragma warning restore 1591