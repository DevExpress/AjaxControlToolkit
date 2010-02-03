<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .hovering 
        {
        	background-color: Yellow
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require(Sys.components.hoverMenu, function() {
            Sys.components.hoverMenu.defaults = {
                popupElement: Sys.get("#menu"),
                HoverCssClass: "hovering",
                PopupPosition: Sys.Extended.UI.HoverMenuPopupPosition.Right
            }
            Sys.query("#hover").hoverMenu({
                HoverDelay: 1000
            });
            Sys.query("#hover2").hoverMenu();
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <div id="hover" style="width:500px">
        Hover over this for 1 second
    </div>
    <div id="hover2" style="width:500px">
        Hover over this
    </div>
    
    <div id="menu" style="display:none; background-color: Gray; border: solid 1px red">
        Some menu<br />
        Some menu<br />
        Some menu<br />
    </div>
    
    
    </div>
    </form>
</body>
</html>
