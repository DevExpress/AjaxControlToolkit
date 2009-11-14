<%@ Page Language="C#" %>
<script runat="server">
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static string[] GetSuggestions(string prefixText) {
        return new string[] {
            prefixText + "abc",
            prefixText + "def",
            prefixText + "ghi",
            prefixText + "jkl",
            prefixText + "mno"
        };
    }
</script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:AjaxScriptManager ID="sm1" runat="server" EnablePageMethods="true" />
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.autoComplete, function() {
            Sys.create.autoComplete("#tb1", {
                minimumPrefixLength: 1,
                serviceMethod: "GetSuggestions",
                servicePath: location.pathname
            });
        });
    </script>
    
    <div>

    <input id="tb1" type="text" style="width:200px;"/>
    
    </div>
    </form>
</body>
</html>
