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
        Sys.debug = true;
        var popup;
        Sys.require(Sys.components.popupBehavior, function() {
            popup = Sys.create.popupBehavior("#target", {
                PopupControlID: "popup",
                Position: Sys.Extended.UI.PopupControlPopupPosition.Bottom
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div id="popup">
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
    </div>
    
    <input type='text' id="target" style="position:absolute;left:100px;top:100px;"/>
    
    </div>
    </form>
</body>
</html>
