<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .shadow
        {
        	background-color: Gray
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require([Sys.components.dropShadow, Sys.components.draggable], function() {
            Sys.create.dropShadow("#shadow", {
                Opacity: 0.8,
                TrackPosition: true,
                Width: 10,
                Rounded: true
            });
            Sys.create.draggable("#shadow", {
                handle: Sys.get("#shadow")
            });
        });
        
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <span id="shadow" class="shadow">
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
    </span>
    
    </div>
    </form>
</body>
</html>
