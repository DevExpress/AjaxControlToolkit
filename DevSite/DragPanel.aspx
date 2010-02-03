<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.draggable, function() {
            Sys.query("#dragme").draggable({
                handle: Sys.get("#dragme")
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server" style="width:1000px;height:1000px">
    <div>
    
    <div id="dragme">
        floating floating floating floating floating floating floating floating floating floating floating floating <br />
        floating floating floating floating floating floating floating floating floating floating floating floating <br />
        floating floating floating floating floating floating floating floating floating floating floating floating <br />
        floating floating floating floating floating floating floating floating floating floating floating floating <br />
    </div>
    
    </div>
    </form>
</body>
</html>
