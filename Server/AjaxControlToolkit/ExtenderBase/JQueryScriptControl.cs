using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [RequiredScript(typeof(JQueryToolkitScripts))]
    public class JQueryScriptControl : ScriptControlBase
    {
        /// <summary>
        /// Control name in lower case
        /// </summary>
        private readonly string _attrControlName;

        private const string DataOptionPrefix = "data-act-";

        #region Constructors

        public JQueryScriptControl(HtmlTextWriterTag tag) :  base(tag) {
            _attrControlName = this.GetType().Name.ToLower();
        }

        protected JQueryScriptControl() {
            _attrControlName = this.GetType().Name.ToLower();
        }

        protected JQueryScriptControl(string tag) : base(tag) {
            _attrControlName = this.GetType().Name.ToLower();
        }

        protected JQueryScriptControl(bool enableClientState, HtmlTextWriterTag tag) : base(enableClientState, tag) {
            _attrControlName = this.GetType().Name.ToLower();
        }

        protected JQueryScriptControl(bool enableClientState) : base(enableClientState) {
            _attrControlName = this.GetType().Name.ToLower();
        }

        protected JQueryScriptControl(bool enableClientState, string tag) : base(enableClientState, tag) {
            _attrControlName = this.GetType().Name.ToLower();
        }

        #endregion

        /// <summary>
        /// Overridden GetScriptDescriptors method avoid any other operations except standard GetScriptDescriptors operation.
        /// </summary>
        /// <returns></returns>
        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors() {
            return null;
        }

        /// <summary>
        /// Overridden GetScriptReferences to avoid script references to be use.
        /// </summary>
        /// <returns></returns>
        protected override IEnumerable<ScriptReference> GetScriptReferences() {
            return null;
        }

        /// <summary>
        /// Overridden OnPreRender method. Build data-options and add it into extender target as an data-options attribute.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);
            if (DesignMode)
                return;

            var dataOptions = JQueryScriptBuilder.BuildDataOptionsAttribute(this);
            this.Attributes.Add(DataOptionPrefix + _attrControlName, dataOptions);
        }

        protected override void Render(HtmlTextWriter writer) {
            DecodeAttributeValues(writer, this);
            base.Render(writer);
        }

        /// <summary>
        /// Replace data-act-* attribute with un-encoded values
        /// </summary>
        /// <param name="writer">Html text writer</param>
        /// <param name="control">Control to evaluate</param>
        protected void DecodeAttributeValues(HtmlTextWriter writer, Control control)
        {
            var attrs = (control as WebControl).Attributes;

            var keys = new string[attrs.Keys.Count];
            attrs.Keys.CopyTo(keys, 0);

            foreach (string attrKey in keys)
            {
                if (attrKey.StartsWith(DataOptionPrefix))
                {
                    var attrVal = attrs[attrKey];
                    attrs.Remove(attrKey);
                    writer.AddAttribute(attrKey, attrVal, false);
                }
            }
        }        
    }
}
