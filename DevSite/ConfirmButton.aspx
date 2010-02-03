<%@ Page Language="C#" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
    <style type="text/css">
        .modalBackground {
	        background-color:Gray;
	        filter:alpha(opacity=70);
	        opacity:0.7;
        }
        #popup 
        {
        	background-color:White;
        }
    </style>
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require([Sys.components.confirmButton, Sys.components.modalPopup], function() {
            Sys.query("#confirm1").confirmButton("Are you SURE?");
            Sys.query("#confirm2").modalPopup({
                id: "modal",
                PopupControlID: "popup",
                OkControlID: "cmdok",
                CancelControlID: "cmdclose",
                BackgroundCssClass: "modalBackground"
            });
            Sys.query("#confirm2").confirmButton("", {
                displayModalPopupID: "modal",
                postBackScript: "alert('post')"
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <input type="button" id="confirm1" value="Confirm (window.confirm)" />
    <input type="button" id="confirm2" value="Confirm (modal dialog)" />
    
    <div id="popup">
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
        Popup Element Popup Element Popup Element Popup Element <br />
        <input type="button" id="cmdok" value="OK" />
        <input type="button" id="cmdclose" value="Cancel" />
    </div>    
    
    </div>
    </form>
</body>
</html>
