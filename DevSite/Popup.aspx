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
        Sys.require(Sys.components.popup, function() {
            popup = Sys.query("#popup").popup({
                parentElementID: "target",
                onShow: '{AnimationName: "Sequence", AnimationChildren: [{AnimationName:"HideAction", visible: true},{AnimationName:"FadeIn"}]}'
            }).get(0);
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
    
    <span id="target" style="position:absolute;left:100px;top:100px;">target</span>
    
    <input type="button" onclick="popup.show()" value="show popup"/>
    <input type="button" onclick="popup.hide()" value="hide popup"/>
    
    </div>
    </form>
</body>
</html>
