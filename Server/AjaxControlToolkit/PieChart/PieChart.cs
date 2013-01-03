using System;
using System.Collections;
using System.ComponentModel.Design.Serialization;
using System.Data;
using System.Configuration;
using System.Reflection;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Script;
using System.ComponentModel;
using System.Xml;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using AjaxControlToolkit;
using System.Text;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Design;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("PieChart.PieChart.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("PieChart.PieChart.debug.js", "application/x-javascript")]
[assembly: WebResource("PieChart.PieChart.css", "text/css", PerformSubstitution = true)]

#endregion

namespace AjaxControlToolkit
{

    /// <summary>
    /// PieChart creates Piechart with the specified values.
    /// </summary>
    [Designer("AjaxControlToolkit.PieChartDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource("PieChart.PieChart.css")]
    [ClientScriptResource("Sys.Extended.UI.PieChart", "PieChart.PieChart.js")]
    public class PieChart : ScriptControlBase
    {
        private PieChartValueCollection pieChartValueList = null;

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new PieChart Control.
        /// </summary>
        public PieChart()
            : base(true, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [Private Properties]
        /// <summary>
        /// Gets whether control is in design mode or not.
        /// </summary>
        private bool IsDesignMode
        {
            get
            {
                return (HttpContext.Current == null);
            }
        }

        #endregion

        #region [ Public Properties ]

        /// <summary>
        /// Width of PieChart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartWidth")]
        public string ChartWidth
        {
            get;
            set;
        }

        /// <summary>
        /// Height of PieChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartHeight")]
        public string ChartHeight
        {
            get;
            set;
        }

        /// <summary>
        /// Title of PieChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitle")]
        public string ChartTitle
        {
            get;
            set;
        }
                
        /// <summary>
        /// Provide list of PieChartValue to client side. Need help from PieChartValues property 
        /// for designer experience support, cause Editor always blocks the property
        /// ability to provide values to client side as ExtenderControlProperty on run time.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public PieChartValueCollection PieChartClientValues
        {
            get
            {
                return pieChartValueList;
            }
        }

        /// <summary>
        /// defines series related to PieChart.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(PieChartValueCollectionEditor), typeof(UITypeEditor))]
        public PieChartValueCollection PieChartValues
        {
            get
            {
                if (pieChartValueList == null)
                    pieChartValueList = new PieChartValueCollection();
                return pieChartValueList;
            }
        }        

        /// <summary>
        /// CSS/Theme file name of PieChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("PieChart")]
        [ClientPropertyName("theme")]
        public string Theme
        {
            get;
            set;
        }

        /// <summary>
        /// CSS/Theme file name of PieChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitleColor")]
        public string ChartTitleColor
        {
            get;
            set;
        }

        #endregion

        #region [ Members ]

        /// <summary>
        /// On Init to validate data.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            if (!IsDesignMode)
            {
                foreach (PieChartValue pieChartValue in PieChartValues)
                {
                    if (pieChartValue.Category == null || pieChartValue.Category.Trim() == "")
                    {
                        throw new Exception("Category is missing in the PieChartValue. Please provide a Category in the PieChartValue.");
                    }

                    if (pieChartValue.Data == null)
                    {
                        throw new Exception("Data is missing in the PieChartValue. Please provide a Data in the PieChartValue.");
                    }
                }
            }
        }
                
        /// <summary>
        /// CreateChilds call to create child controls for PieChart.
        /// </summary>
        internal void CreateChilds()
        {
            this.Controls.Clear();
            this.CreateChildControls();
        }

        /// <summary>
        /// CreateChildControls creates html controls for a PieChart control.
        /// </summary>
        protected override void CreateChildControls()
        {
            GenerateHtmlInputControls();
        }


        /// <summary>
        /// GenerateHtmlInputControls creates parent div for PieChart control.
        /// </summary>
        /// <returns>Return the client id of parent div that contains all other html controls.</returns>
        protected string GenerateHtmlInputControls()
        {
            HtmlGenericControl parent = new HtmlGenericControl("div");
            parent.ID = "_ParentDiv";            
            parent.Attributes.Add("style", "border-style:solid; border-width:1px;");
            Controls.Add(parent);
            
            return parent.ClientID;
        }

        /// <summary>
        /// DescribeComponent creates propreties in ScriptComponentDescriptor for child controls in PieChart.
        /// </summary>
        /// <param name="descriptor">Descriptor object which will accpet server components to convert in client script.</param>
        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            if (!IsDesignMode)
            {
                
            }
        }

        #endregion
       
    }
}
