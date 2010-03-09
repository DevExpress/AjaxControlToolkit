using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml.Linq;

namespace SDRServerControls
{
    /// <summary>
    /// Summary description for ImageView
    /// </summary>
    [
    ToolboxData("<{0}:ImageView runat=server></{0}:ImageView>")
    ]
    public class ImageView : ScriptControl
    {
        private string _data;
        private string _dataProvider;
        private string _fetchOperation = "";
        private string _fetchParameters = "";
        private bool _autoFetch = true;

        public ImageView()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        public virtual String Data
        {
            get
            {
                return _data;
            }
            set
            {
                _data= value;
            }
        }
        public virtual String DataProvider
        {
            get
            {
                return _dataProvider;
            }
            set
            {
                _dataProvider = value;
            }
        }
        public virtual String FetchOperation
        {
            get
            {
                return _fetchOperation;
            }
            set
            {
                _fetchOperation = value;
            }
        }
        public virtual String FetchParameters
        {
            get
            {
                return _fetchParameters;
            }
            set
            {
                _fetchParameters = value;
            }
        }
        public virtual bool AutoFetch
        {
            get
            {
                return _autoFetch;
            }
            set
            {
                _autoFetch = value;
            }
        }

        #region IScriptControl
        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors()
        {
            ScriptControlDescriptor descriptor = new ScriptControlDescriptor("My.Controls.ImageView", this.ClientID);
            //descriptor.AddProperty("data", this.Data);
            descriptor.AddScriptProperty("data", this.Data);
            descriptor.AddProperty("dataProvider", this.DataProvider);
            descriptor.AddProperty("fetchOperation", this.FetchOperation);
            descriptor.AddProperty("fetchParameters", this.FetchParameters);
            descriptor.AddProperty("autoFetch", this.AutoFetch);
            yield return descriptor;
        }

        // Generate the script reference
        protected override IEnumerable<ScriptReference> GetScriptReferences()
        {
            yield return new ScriptReference("SDRServerControls.ImageView.js", this.GetType().Assembly.FullName);
            //ScriptReference reference = new ScriptReference();
            //reference.Path = ResolveClientUrl("ImageView.js");

//            yield return reference;
        }
        #endregion
    }
}



