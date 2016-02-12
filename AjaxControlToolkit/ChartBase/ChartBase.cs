#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [Designer(typeof(ChartBaseDesigner))]
    public abstract class ChartBase : ScriptControlBase {

        public ChartBase()
            : base(true, HtmlTextWriterTag.Div) {
        }

        protected bool IsDesignMode {
            get { return (HttpContext.Current == null); }
        }

        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartWidth")]
        public string ChartWidth { get; set; }

        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartHeight")]
        public string ChartHeight { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitle")]
        public string ChartTitle { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitleColor")]
        public string ChartTitleColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("PieChart")]
        [ClientPropertyName("theme")]
        public string Theme { get; set; }

        protected override void CreateChildControls() {
            var root = new HtmlGenericControl("div");
            root.ID = "_ParentDiv";
            root.Attributes.Add("style", "border-style:solid; border-width:1px;");
            Controls.Add(root);
        }
    }

}
#pragma warning restore 1591