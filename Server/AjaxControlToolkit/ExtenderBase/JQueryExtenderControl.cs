using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// Base class to build extender control using jQuery.
    /// </summary>
    [RequiredScript(typeof(JQueryToolkitScripts))]
    public abstract class JQueryExtenderControl : ExtenderControlBase {

        /// <summary>
        /// Control name in lower case
        /// </summary>
        private readonly string _attrControlName;

        /// <summary>
        /// The name of jQuery widget function 
        /// </summary>
        private readonly string _widgetFunctionName;

        private Type _targetControlType;

        private const string DataOptionPrefix = "data-act-";

        /// <summary>
        /// JQueryExtenderControl constructor.
        /// </summary>
        protected JQueryExtenderControl() {
            var name = this.GetType().Name;
            _attrControlName = name.ToLower();
            _widgetFunctionName = name.Substring(0, 1).ToLower() + name.Substring(1);
        }

        /// <summary>7
        /// Overridden OnPreRender method. Build data-options and add it into extender target as an data-options attribute.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            if (DesignMode)
                return;

            var dataOptions = JQueryScriptBuilder.BuildDataOptionsAttribute(this);
            var targetControl = this.TargetControl as WebControl;
            if (targetControl == null)
                throw new Exception("Target control type must be WebControl");

            _targetControlType = targetControl.GetType();

            // Hijack rendering method, we want to pure data-options attribute rendering (un-encoded) 
            targetControl.Parent.SetRenderMethodDelegate(RenderTargetControl);
            var attrs = (targetControl is CheckBox)
                ? (targetControl as CheckBox).InputAttributes
                : targetControl.Attributes;
            attrs.Add(DataOptionPrefix + _attrControlName, dataOptions);
        }

        /// <summary>
        /// Delegate method for extender target control parent SetRenderMethodDelegate method
        /// </summary>
        private void RenderTargetControl(HtmlTextWriter writer, Control parent) {
            foreach (Control control in parent.Controls) {
                if (control.GetType() == _targetControlType) {
                    DecodeAttributeValues(writer, control);
                }
                control.RenderControl(writer);
            }
        }        

        /// <summary>
        /// Replace data-act-* attribute with un-encoded values
        /// </summary>
        /// <param name="writer">Html text writer</param>
        /// <param name="control">Control to evaluate</param>
        private void DecodeAttributeValues(HtmlTextWriter writer, Control control) {
            var targetControl = control as WebControl;
            var attrs = (targetControl is CheckBox)
                ? (targetControl as CheckBox).InputAttributes
                : targetControl.Attributes;

            var keys = new string[attrs.Keys.Count];
            attrs.Keys.CopyTo(keys, 0);

            foreach (string attrKey in keys) {
                if (attrKey.StartsWith(DataOptionPrefix)) {
                    var attrVal = attrs[attrKey];
                    attrs.Remove(attrKey);
                    writer.AddAttribute(attrKey, attrVal, false);
                }
            }
        }

        /// <summary>
        /// Overridden GetScriptDescriptors method avoid any other operations except standard GetScriptDescriptors operation.
        /// </summary>
        /// <param name="targetControl"></param>
        /// <returns></returns>
        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors(Control targetControl) {
            return null;
        }

        /// <summary>
        /// Overridden GetScriptReferences to avoid script references to be use.
        /// </summary>
        /// <returns></returns>
        protected override IEnumerable<ScriptReference> GetScriptReferences() {
            return null;
        }
    }
}