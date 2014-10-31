using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [TargetControlType(typeof(Control))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(HoverExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [ClientCssResource(Constants.DropDownName)]
    [ClientScriptResource("Sys.Extended.UI.DropDownBehavior", Constants.DropDownName)]
    [Designer("AjaxControlToolkit.Designer.DropDownDesigner, AjaxControlToolkit")]
    [ToolboxItem("System.Web.UI.Design.WebControlToolboxItem, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")]
    [ToolboxBitmap(typeof(DropDownExtender), Constants.DropDownName + Constants.IconPostfix)]
    public class DropDownExtender : DynamicPopulateExtenderControlBase {
        [DefaultValue("")]
        [IDReferenceProperty(typeof(Control))]
        [ExtenderControlProperty]
        [ElementReference]
        [ClientPropertyName("dropDownControl")]
        public string DropDownControlID {
            get { return (string)(ViewState["DropDownControlID"] ?? String.Empty); }
            set { ViewState["DropDownControlID"] = value; }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBorderColor")]
        public Color HighlightBorderColor {
            get { return (Color)(ViewState["HighlightBorderColor"] ?? Color.Empty); }
            set { ViewState["HighlightBorderColor"] = value; }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightBackgroundColor")]
        public Color HighlightBackColor {
            get { return (Color)(ViewState["HighlightBackColor"] ?? Color.Empty); }
            set { ViewState["HighlightBackColor"] = value; }
        }

        [DefaultValue(typeof(Color), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowBackgroundColor")]
        public Color DropArrowBackColor {
            get { return (Color)(ViewState["DropArrowBackColor"] ?? Color.Empty); }
            set { ViewState["DropArrowBackColor"] = value; }
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowImageUrl")]
        public string DropArrowImageUrl {
            get { return (string)(ViewState["DropArrowImageUrl"] ?? String.Empty); }
            set { ViewState["DropArrowImageUrl"] = value; }
        }

        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("dropArrowWidth")]
        public Unit DropArrowWidth {
            get { return (Unit)(ViewState["DropArrowWidth"] ?? Unit.Empty); }
            set { ViewState["DropArrowWidth"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("popup")]
        public string OnClientPopup {
            get { return (string)(ViewState["OnClientPopup"] ?? String.Empty); }
            set { ViewState["OnClientPopup"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populating")]
        public string OnClientPopulating {
            get { return (string)(ViewState["OnClientPopulating"] ?? String.Empty); }
            set { ViewState["OnClientPopulating"] = value; }
        }

        [DefaultValue("")]
        [Category("Behavior")]
        [ExtenderControlEvent]
        [ClientPropertyName("populated")]
        public string OnClientPopulated {
            get { return (string)(ViewState["OnClientPopulated"] ?? String.Empty); }
            set { ViewState["OnClientPopulated"] = value; }
        }

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