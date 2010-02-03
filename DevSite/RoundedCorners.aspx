<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .rounded
        {
        	background-color: Gray;
        	width: 300px;
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.require(Sys.components.rounded, function() {
            Sys.query("#rounded").rounded({
                Radius: 10
            });
        });
        
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div>
    <div id="rounded" class="rounded">
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
        fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter fillter <br />
    </div>
    </div>
    
    </div>
    </form>
</body>
</html>
