<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        #popup 
        {
        	width: 200px;
        	height: 200px;
        	background-color: Gray;
        	border: dashed 2px red;
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        function onHover() {
            $get('log').innerHTML += "hover<br/>";
        }
        function onUnhover() {
            $get('log').innerHTML += "unhover<br/>";
        }
        
        Sys.debug = true;
        Sys.require(Sys.components.hover, function() {
            Sys.create.hover("#hover", {
                hover: onHover,
                hoverDelay: 1000,
                unhover: onUnhover
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div id="hover">
        Hover over this for 1 second
    </div>
    
    <div id="log">Log:<br /></div>
    
    
    </div>
    </form>
</body>
</html>
