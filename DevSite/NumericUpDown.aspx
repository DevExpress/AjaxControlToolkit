<%@ Page Language="C#" %>
<script runat="server">
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static int GetDown(int current) {
        return current / 10;
    }
    
    [System.Web.Services.WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static int GetUp(int current) {
        return current * 10;
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
<asp:ToolkitScriptManager runat="server" EnablePageMethods="true" EnablePartialRendering="false" />


<input id="updown1" type="text" value="0" style="width:85px" />    
<br />
<input id="updown2" type="text" value="a" style="width:85px" />    
<br />
<input id="updown3" type="text" value="50000" style="width:150px" />    

<script type="text/javascript">
    Sys.debug = true;
    Sys.require(Sys.components.upDown, function() {
        Sys.query("#updown1").upDown(-10, 10, 100);
        Sys.query("#updown2").upDown(-10, 10, 100, {
            RefValues: "a;b;c"
        });
        Sys.query("#updown3").upDown(null, null, 150, {
            ServiceDownMethod: "GetDown",
            ServiceUpMethod: "GetUp"
        });
    });
</script>
    
</form>
    
</body>
</html>
