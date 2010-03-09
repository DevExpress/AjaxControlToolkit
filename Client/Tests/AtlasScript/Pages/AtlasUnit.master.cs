using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml;
using System.Web.UI;
using System.Text;

public partial class AtlasUnit : System.Web.UI.MasterPage {
    protected void Page_Init(object sender, EventArgs e) {
        string scriptPath = Request.Params["scriptPath"];
        if (!String.IsNullOrEmpty(scriptPath)) {
            ScriptManager1.ScriptPath = scriptPath;
        }

        ScriptMode scriptMode = ScriptMode.Auto;
        string scriptModeParam = Request.Params["scriptMode"];
        if (!String.IsNullOrEmpty(scriptModeParam)) {
            scriptMode = (ScriptMode)Enum.Parse(typeof(ScriptMode), scriptModeParam);
        }
        ScriptManager1.ScriptMode = scriptMode;
        ScriptManager1.ResolveScriptReference += (s, args) => {
            if (String.IsNullOrEmpty(args.Script.Assembly) && !String.IsNullOrEmpty(args.Script.Name)) {
                args.Script.Assembly = "System.Web.Ajax";
            }
        };

        Page.Title += (ScriptManager1.IsDebuggingEnabled ? " Debug" : " Release");
    }

    protected void Page_Load(object sender, EventArgs e) {
        AtlasUnitUtil.AddScriptReference(Page, "AtlasUnit.js");

        string projectUrl = Request.Params["projectUrl"];

        if (String.IsNullOrEmpty(projectUrl)) {
            throw new ArgumentNullException("projectUrl",
                "You must specify the projectUrl in the query string.  For example:" + Environment.NewLine +
                "http://localhost/atlasunit/AtlasUnitConsole.aspx?projecturl=AtlasUnitTestProject.xml");
        }

        Uri projectUri = new Uri(Request.Url, projectUrl);
        XmlDocument project = new XmlDocument();
        project.Load(projectUri.ToString());

        XmlNodeList references = project.SelectNodes("project/references/reference");
        foreach (XmlNode reference in references) {
            XmlAttribute pathAttribute = reference.Attributes["path"];
            XmlAttribute assemblyAttribute = reference.Attributes["assembly"];
            XmlAttribute nameAttribute = reference.Attributes["name"];
            ScriptReference scriptReference = new ScriptReference();
            if (pathAttribute != null) {
                scriptReference.Path = pathAttribute.Value;
            }
            if (assemblyAttribute != null) {
                scriptReference.Assembly = assemblyAttribute.Value;
            }
            if (nameAttribute != null) {
                scriptReference.Name = nameAttribute.Value;
            }
            ScriptManager1.Scripts.Add(scriptReference);
        }

        XmlNodeList files = project.SelectNodes("project/files/file");
        foreach (XmlNode file in files) {
            Uri scriptUri = new Uri(projectUri, file.InnerText);
            Uri relativeScriptUri = Request.Url.MakeRelativeUri(scriptUri);
            AtlasUnitUtil.AddScriptReference(Page, relativeScriptUri.ToString());
        }

        string scriptFormat = @"
function buildSuite() {{
    var suiteBuilder = new AtlasUnit.TestSuiteBuilder();
{0}
    return suiteBuilder.build();
}}";

        StringBuilder sb = new StringBuilder();
        XmlNodeList nameSpaces = project.SelectNodes("project/nameSpaces/nameSpace");
        foreach (XmlNode nameSpace in nameSpaces) {
            sb.AppendLine(String.Format("    suiteBuilder.addNameSpace({0});", nameSpace.InnerText));
        }

        string script = String.Format(scriptFormat, sb.ToString());

        Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "buildSuite", script, true);
    }
}
