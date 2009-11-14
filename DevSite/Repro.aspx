<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ Register TagPrefix="swa" Assembly="System.Web.Ajax" Namespace="System.Web.UI" %>
<%@ Register TagPrefix="swae" Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <swa:AjaxScriptManager ID="sm1" runat="server">
    <Scripts>
        <asp:ScriptReference Name="MicrosoftAjax.js" />
        <asp:ScriptReference Name="MicrosoftAjaxWebForms.js" />
        <asp:ScriptReference Name="MicrosoftAjaxTemplates.js" />
    </Scripts>
    </swa:AjaxScriptManager>
    <script>
    Sys.components._test = true;
    alert(Sys.components._test);
    </script>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script>
    alert(Sys.components._test);
    </script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.require([Sys.components.watermark]);
        Sys.onReady(ready);
        function ready() {
            Sys.create.watermark("#wm1", "hi");
        }
    </script>
    <div>
        <input type="text" id="wm1" />
    </div>
    </form>
</body>
</html>

