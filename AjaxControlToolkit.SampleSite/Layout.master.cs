using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

public partial class Layout : System.Web.UI.MasterPage {
    protected void Page_Init(object sender, EventArgs e) {
    }

    protected void Page_Load(object sender, EventArgs e) {
        var controlDocBlocks = GetControlsByType<HtmlGenericControl>(this).Where(c => c.Attributes["data-control-type"] != null);
        FillDescription(controlDocBlocks.Where(b => b.Attributes["data-content-type"] == "description"));
        FillProperties(controlDocBlocks.Where(b => b.Attributes["data-content-type"] == "members"));
    }

    void FillProperties(IEnumerable<HtmlGenericControl> controlDocBlocks) {
        foreach(var block in controlDocBlocks) {
            var filePath = Server.MapPath("~/App_Data/ControlReference/" + block.Attributes["data-control-type"] + ".Members.html");
            var text = File.ReadAllText(filePath);
            block.InnerHtml = text;
        }
    }

    void FillDescription(IEnumerable<HtmlGenericControl> controlDocBlocks) {
        foreach(var block in controlDocBlocks) {
            var filePath = Server.MapPath("~/App_Data/ControlReference/" + block.Attributes["data-control-type"] + ".Description.html");
            var text = File.ReadAllText(filePath);
            block.InnerHtml = text;
        }
    }

    IEnumerable<T> GetControlsByType<T>(Control root, Func<T, bool> predicate = null) where T : Control {
        if(root == null)
            throw new ArgumentNullException("root");

        var stack = new Stack<Control>(new Control[] { root });
        var result = new List<T>();

        while(stack.Count > 0) {
            var control = stack.Pop();
            T match = control as T;

            if(match != null && (predicate == null || predicate(match)))
                result.Add(match);

            foreach(Control childControl in control.Controls)
                stack.Push(childControl);
        }

        return result;
    }
}
