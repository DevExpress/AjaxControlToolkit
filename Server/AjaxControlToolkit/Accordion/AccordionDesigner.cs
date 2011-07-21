

using System;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.Web.UI.Design;
using System.Web.UI.Design.WebControls;
using System.Linq;
using System.Collections.Generic;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Simple read-only designer for the Accordion control
    /// </summary>
    [SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class AccordionDesigner : ControlDesigner
    {
        /// <summary>
        /// Reference to the Accordion control we're designing
        /// </summary>
        private Accordion _accordion;

        /// <summary>
        /// Initializes a new instances of the AccordionDesigner class
        /// </summary>
        [SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public AccordionDesigner()
        {
        }

        /// <summary>
        /// Initialize to make sure we're attached to an accordion control
        /// </summary>
        /// <param name="component">Component</param>
        [SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        [SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override void Initialize(IComponent component)
        {
            _accordion = component as Accordion;
            if (_accordion == null)
                throw new ArgumentException("Component must be an Accordion control", "component");
            base.Initialize(component);
        }

        /// <summary>
        /// Get the HTML for the Accordion
        /// </summary>
        /// <returns>HTML design time representation</returns>
        [SuppressMessage("Microsoft.Performance", "CA1804:RemoveUnusedLocals", MessageId = "controls", Justification = "See code comment below")]
        [SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetDesignTimeHtml()
        {
            if (_accordion.Height == Unit.Empty)
                _accordion.Height = new Unit(175);

            if (_accordion.Width == Unit.Empty)
                _accordion.Width = new Unit(300);

            // Ensure the controls have been created
            ControlCollection controls = _accordion.Controls;

            // Get the base html for the accordion's div
            // so that any accordion styles will be applied   
            // Remove the closing div tag so we can insert the HTML
            // for all of the panes
            string originalHtml = base.GetDesignTimeHtml();

            int lastIdx = originalHtml.ToString().IndexOf("<div", 1);
            if (lastIdx > 0)
                originalHtml = originalHtml.ToString().Substring(0, (originalHtml.ToString().IndexOf("<div", 1)));
            else
                originalHtml = originalHtml.Remove(originalHtml.Length - 6, 6);

            // remove all tabs and new lines
            originalHtml = originalHtml
                    .Replace("\r", "")
                    .Replace("\n", "")
                    .Replace("\t", "");

            // apply overflow:scroll so user will able to see accordion contents in design time 
            // when it's overflow style if it doesn't exists
            if (!originalHtml.Contains("overflow"))
            {
                originalHtml = originalHtml.Replace("style=\"", "style=\"overflow:scroll;");
            }

            StringBuilder html = new StringBuilder(originalHtml);
            // Add the HTMl for each pane ---------------
            // Clone Panes to prevent direct access to _accordion.Panes so it will avoid 
            //    "collection was modified enumeration operation may not execute" exception when user
            //    modify design in source view and back again to design view
            foreach (AccordionPane pane in (AccordionPane[])_accordion.Panes.ToArray().Clone())
            {
                html.Append("<span>");
                string headerCSS = !string.IsNullOrEmpty(pane.HeaderCssClass) ? pane.HeaderCssClass : _accordion.HeaderCssClass;
                html.AppendFormat("<div class=\"{0}\">", headerCSS);
                TemplateBuilder builder = pane.Header as TemplateBuilder;
                if (builder != null)
                    html.Append(builder.Text);
                else
                {
                    html.Append("AccordionPane Header ");
                    html.Append(pane.ID);
                }
                html.Append("</div>");

                string contentCSS = !string.IsNullOrEmpty(pane.ContentCssClass) ? pane.ContentCssClass : _accordion.ContentCssClass;
                html.AppendFormat("<div class=\"{0}\">", contentCSS);
                builder = pane.Content as TemplateBuilder;
                if (builder != null)
                    html.Append(builder.Text);
                else
                {
                    html.Append("AccordionPane Content ");
                    html.Append(pane.ID);
                }

                html.Append("</div>");
                html.Append("</span>");
            }

            html.Append("</div>");
            return html.ToString();
        }
    }
}