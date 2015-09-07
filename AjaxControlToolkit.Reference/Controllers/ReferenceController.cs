using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Parsing;
using AjaxControlToolkit.Reference.Core.Rendering;
using AjaxControlToolkit.ReferenceCore.Parsing;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Controllers {

    public class ReferenceController : Controller {
        const string ActNamespace = "AjaxControlToolkit";

        public ActionResult Index() {
            var typeNames = new string[] {
                "Accordion",
                "AjaxFileUpload",
                "AlwaysVisibleControlExtender",
                "Animation",
                "AreaChart",
                "AsyncFileUpload",
                "AutoCompleteExtender",
                "BalloonPopupExtender",
                "BarChart",
                "BubbleChart",
                "CalendarExtender",
                "CascadingDropDown",
                "CollapsiblePanelExtender",
                "ColorPickerExtender",
                "ComboBox",
                "ConfirmButtonExtender",
                "DragPanelExtender",
                "DropDownExtender",
                "DropShadowExtender",
                "DynamicPopulateExtender",
                "FilteredTextBoxExtender",
                "Gravatar",
                "HoverMenuExtender",
                "HtmlEditorExtender",
                "LineChart",
                "ListSearchExtender",
                "MaskedEditExtender",
                "ModalPopupExtender",
                "MultiHandleSliderExtender",
                "MutuallyExclusiveCheckBoxExtender",
                "NoBot",
                "NumericUpDownExtender",
                "PagingBulletedListExtender",
                "PasswordStrength",
                "PieChart",
                "PopupControlExtender",
                "Rating",
                "ReorderList",
                "ResizableControlExtender",
                "RoundedCornersExtender",
                "Seadragon",
                "SliderExtender",
                "SlideShowExtender",
                "TabPanel",
                "TextBoxWatermarkExtender",
                "ToggleButtonExtender",
                "Twitter",
                "UpdatePanelAnimationExtender",
                "ValidatorCalloutExtender"
            };

            return View(typeNames);
        }

        public ContentResult Markup(string typeName) {
            var doc = GetDoc(typeName);

            foreach(var docType in doc.Types.ToList()) {
                var typeFullName = docType.Namespace + "." + GetNeededType(docType.Name);
                FillClientMembers(doc, typeFullName);
            }

            var codeplexDocRenderer = new CodePlexDocRenderer();
            var extenderDoc = new ExtenderDoc(codeplexDocRenderer);
            var markup = extenderDoc.BuildDoc(doc.Types);
            var wikiEngine = new WikiPlex.WikiEngine();

            return Content(wikiEngine.Render(markup));
        }

        string GetNeededType(string typeName) {
            switch(typeName) {
                case "Accordion":
                    return "AccordionExtender";
                default:
                    return typeName;
                    break;
            }
        }

        void FillClientMembers(Documentation doc, string typeFullName) {
            var actAssembly = typeof(ToolkitResourceManager).Assembly;
            var type = actAssembly.GetType(typeFullName, true);

            if(type.IsSubclassOf(typeof(ExtenderControlBase))
                ||
                type.IsSubclassOf(typeof(ScriptControlBase))) {
                var clientScriptName = type
                    .CustomAttributes
                    .First(a => a.AttributeType.Name == "ClientScriptResourceAttribute")
                    .ConstructorArguments[1];
                var jsFileName = clientScriptName.Value + ".js";

                var jsLines = System.IO.File.ReadAllLines(Server.MapPath("~/bin/Scripts/" + jsFileName));
                var commentParser = new CommentParser();
                var clientMembers = commentParser.ParseFile(jsLines);

                doc.Add(clientMembers, ContentType.Text);
            }
        }

        Documentation GetDoc(string type) {
            var doc = new Documentation();
            var xml = LoadXml(Server.MapPath("~/bin/AjaxControltoolkit.xml"));

            var members = xml.Root.Element("members").Elements()
                .Where(el => el.Attribute("name").Value.Contains("AjaxControlToolkit." + type))
                .Select(el => new RawDoc(el.Attribute("name").Value) {
                    Elements = el.Elements()
                })
                .OrderBy(el => el.TargetFullName);

            doc.Add(members, ContentType.Xml);

            return doc;
        }

        static XDocument LoadXml(string fileName) {
            XDocument xml;
            if(!System.IO.File.Exists(fileName))
                throw new ArgumentException(String.Format("File '{0}' not found", fileName), "fileName");

            xml = XDocument.Load(fileName);
            if(xml == null)
                throw new ArgumentException(String.Format("Unable to load XML from '{0}'", fileName), "fileName");

            return xml;
        }
    }

}
