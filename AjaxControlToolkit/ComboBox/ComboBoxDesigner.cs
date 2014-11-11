using System;
using System.ComponentModel.Design;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web.UI.Design.WebControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    public class ComboBoxDesigner : ListControlDesigner {
        public override string GetDesignTimeHtml() {
            // first, save current items before the base method resets them
            var control = (ListControl)base.ViewControl;
            var originalItems = new ListItem[control.Items.Count];
            control.Items.CopyTo(originalItems, 0);

            // now, let the base method reset them
            var baseHtml = base.GetDesignTimeHtml();

            // repopulate with original items
            control.Items.Clear();
            control.Items.AddRange(originalItems);

            // try to render as much resourced CSS as possible in the designer
            var assembly = Assembly.GetExecutingAssembly();
            var cssStream = assembly.GetManifestResourceStream(Constants.ComboBoxName);
            var cssReader = new StreamReader(cssStream);
            var cssString = cssReader.ReadToEnd();

            // perform CSS substitution for the designer 
            const string SUBSTITUTION_PATTERN = @"(<%=)\s*(WebResource\("")(?<resourceName>.+)\s*(""\)%>)";
            var regex = new Regex(SUBSTITUTION_PATTERN);
            cssString = regex.Replace(cssString, new MatchEvaluator(PerformWebResourceSubstitution));

            return "<style>" + cssString + "</style>" + baseHtml;
        }

        protected virtual string PerformWebResourceSubstitution(Match match) {
            var replacedString = match.ToString();
            replacedString = replacedString.Replace(match.Value, ViewControl.Page.ClientScript.GetWebResourceUrl(
                this.GetType(), match.Groups["resourceName"].Value));
            return replacedString;
        }

        public override bool AllowResize {
            get { return false; }
        }

        public override DesignerActionListCollection ActionLists {
            get {
                var actionLists = new DesignerActionListCollection();
                actionLists.AddRange(base.ActionLists);
                actionLists.Add(new ComboBoxDesignerActionList(Component));
                return actionLists;
            }
        }
    }

}
