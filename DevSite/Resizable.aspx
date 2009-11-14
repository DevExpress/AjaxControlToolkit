<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .resize
        {
        	background-color: Gray;
        	border: dashed 2px red;
        	width: 300px;
        	height: 200px;
        	overflow: scroll
        }
        .sizing 
        {
        	background-color: Blue;
        }
        .handle 
        {
        	background-color: Red;
        	width: 10px;
        	height: 10px;
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.require(Sys.components.resizable, function() {
            Sys.create.resizable("#resize", {
                HandleCssClass: "handle",
                ResizableCssClass: "sizing"
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div id="resize" class="resize">
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
        filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler filler <br />
    </div>
    
    
    </div>
    </form>
</body>
</html>
