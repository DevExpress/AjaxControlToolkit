<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .always 
        {
        	background-color: Yellow
        }
    </style>
    <script type="text/javascript" src="scripts/start.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.alwaysVisible, function() {
            Sys.query(".always").alwaysVisible({ useAnimation: false, VerticalSide: Sys.Extended.UI.VerticalSide.Middle });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div class="always">
        hello :)
    </div>
    
    <% for (int i = 0; i < 10000; i++) { %>
    content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content <br />
    <% } %>
    </div>
    </form>
</body>
</html>
