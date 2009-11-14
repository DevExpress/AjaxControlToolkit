<%@ Page Language="C#" %>
<script runat="server">
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static string GetHTML() {
        System.Threading.Thread.Sleep(3000);
        return "<span>LOADED</span>";
    }
</script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .dynamic 
        {
        	background-color: Gray;
        }
        .updating 
        {
        	background-color: Yellow
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:AjaxScriptManager ID="sm1" runat="server" EnablePageMethods="true" />
    <script type="text/javascript">
        Sys.debug = true;
        var popup;
        Sys.require(Sys.components.dynamicPopulate, function() {
            popup = Sys.create.dynamicPopulate("#dynamic", {
                PopulateTriggerID: "cmdLoad",
                ServiceMethod: "GetHTML",
                UpdatingCssClass: "updating",
                ClearContentsDuringUpdate: false
            });
        });
    </script>
    
    <div>
    
    <div id="dynamic" class="dynamic">
        loading...
    </div>
    
    <br />
    
    <input id="cmdLoad" type="button" value="Load It"/>
    
    </div>
    </form>
</body>
</html>
