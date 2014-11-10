using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Drawing.Design;
using AjaxControlToolkit.Design;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.PieChartDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource(Constants.PieChartName)]
    [ClientScriptResource("Sys.Extended.UI.PieChart", Constants.PieChartName)]
    public class PieChart : ScriptControlBase {
        PieChartValueCollection pieChartValueList = null;

        public PieChart()
            : base(true, HtmlTextWriterTag.Div) {
        }

        bool IsDesignMode {
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

        // Provide list of PieChartValue to client side. Need help from PieChartValues property 
        // for designer experience support, cause Editor always blocks the property
        // ability to provide values to client side as ExtenderControlProperty on run time.
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public PieChartValueCollection PieChartClientValues {
            get { return pieChartValueList; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(PieChartValueCollectionEditor), typeof(UITypeEditor))]
        public PieChartValueCollection PieChartValues {
            get {
                if(pieChartValueList == null)
                    pieChartValueList = new PieChartValueCollection();
                return pieChartValueList;
            }
        }

        [ExtenderControlProperty]
        [DefaultValue("PieChart")]
        [ClientPropertyName("theme")]
        public string Theme { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitleColor")]
        public string ChartTitleColor { get; set; }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(PieChartValue pieChartValue in PieChartValues) {
                if(pieChartValue.Category == null || pieChartValue.Category.Trim() == String.Empty)
                    throw new Exception("Category is missing in the PieChartValue. Please provide a Category in the PieChartValue.");

                if(pieChartValue.Data == null)
                    throw new Exception("Data is missing in the PieChartValue. Please provide a Data in the PieChartValue.");
            }
        }

        internal void CreateChilds() {
            Controls.Clear();
            CreateChildControls();
        }

        protected override void CreateChildControls() {
            GenerateHtmlInputControls();
        }

        protected string GenerateHtmlInputControls() {
            var parent = new HtmlGenericControl("div");
            parent.ID = "_ParentDiv";
            parent.Attributes.Add("style", "border-style:solid; border-width:1px;");
            Controls.Add(parent);

            return parent.ClientID;
        }
    }

}