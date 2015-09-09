using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// DropDown is an ASP.NET AJAX extender that can be attached to almost any ASP.NET control
    /// to provide a SharePoint-style drop-down menu.
    /// </summary>
    [TargetControlType(typeof(WebControl))]
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
        /// The ID of the control which will be displayed as the dropdown
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
        /// Highlight border color
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBorderColor")]
        public Color HighlightBorderColor {
            get { return (Color)(ViewState["HighlightBorderColor"] ?? Color.Empty); }
            set { ViewState["HighlightBorderColor"] = value; }
        }

        /// <summary>
        /// Highlight background color
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBackgroundColor")]
        public Color HighlightBackColor {
            get { return (Color)(ViewState["HighlightBackColor"] ?? Color.Empty); }
            set { ViewState["HighlightBackColor"] = value; }
        }

        /// <summary>
        /// Arrow background color
        /// </summary>
        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowBackgroundColor")]
        public Color DropArrowBackColor {
            get { return (Color)(ViewState["DropArrowBackColor"] ?? Color.Empty); }
            set { ViewState["DropArrowBackColor"] = value; }
        }

        /// <summary>
        /// Arrow image URL
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
        /// Arrow width
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowWidth")]
        public Unit DropArrowWidth {
            get { return (Unit)(ViewState["DropArrowWidth"] ?? Unit.Empty); }
            set { ViewState["DropArrowWidth"] = value; }
        }

        /// <summary>
        /// Popup event
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
        /// Populating event
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
        /// Populated event
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
        /// The OnShow animation will be played each time the dropdown is displayed.
        /// The dropdown will be positioned correctly but hidden.
        /// The animation can use to display the dropdown along with any other visual effects
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
        /// The OnHide animation will be played each time the dropdown is hidden
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