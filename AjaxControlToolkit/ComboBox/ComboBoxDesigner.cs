#pragma warning disable 1591
using System;
using System.ComponentModel.Design;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web.UI.Design.WebControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Design {

    public class ComboBoxDesigner : ListControlDesigner {
        const string substitutionPattern = @"(<%=)\s*(WebResource\("")(?<resourceName>.+)\s*(""\)%>)";

        public override string GetDesignTimeHtml() {
            var control = (ListControl)base.ViewControl;
            var originalItems = new ListItem[control.Items.Count];
            control.Items.CopyTo(originalItems, 0);

            var baseHtml = base.GetDesignTimeHtml();

            control.Items.Clear();
            control.Items.AddRange(originalItems);

            var cssString = GetStringFromResourceStream(Constants.StyleResourcePrefix + Constants.ComboBoxName + Constants.CssPostfix) +
                GetStringFromResourceStream(Constants.StyleResourcePrefix + Constants.BackgroundStylesName + Constants.CssPostfix);
            
            var regex = new Regex(substitutionPattern);
            cssString = regex.Replace(cssString, new MatchEvaluator(PerformWebResourceSubstitution));

            return "<style>" + cssString + "</style>" + baseHtml;
        }

        string GetStringFromResourceStream(string resourceName) {
            var resourceStream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);

            return (new StreamReader(resourceStream)).ReadToEnd();
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

#pragma warning restore 1591