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
    <link rel="Stylesheet" href="scripts/extended/calendar/calendar.css" />
    <script type="text/javascript" src="scripts/start.debug.js"></script>
    <script type="text/javascript" src="scripts/extended/extendedcontrols.js"></script>
    <script type="text/javascript">
        Sys.debug = true;
        Sys.require([Sys.components.watermark, Sys.components.calendar, Sys.components.modalPopup], function() {
            Sys.create.modalPopup("#show", {
                PopupControlID: "popup",
                OkControlID: "buttonOK",
                CancelControlID: "buttonCancel",
                OnOkScript: okayWasClicked,
                OnCancelScript: cancelWasClicked,
                BackgroundCssClass: "modalBackground"
            });
            Sys.create.watermark("#theDate", "Click to select date...", "myDate");
            Sys.create.watermark("#myName", "Enter your name", "myName");
            Sys.create.watermark("#myCompany", "Enter your company", "myCompany");
            Sys.create.calendar("#theDate", {
                popupPosition: Sys.Extended.UI.CalendarPosition.Right
            });
        });
        function okayWasClicked() {
            Sys.get("#statusSpan").innerText = "You Clicked OK";
        }
        function cancelWasClicked() {
            Sys.get("#statusSpan").innerText = "You Clicked Cancel";
        }      
          
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <span id="statusSpan" class="status"></span><br />
    
    <table id="popup" style="width:500px; margin:0px auto; background-color:white; display:none">
        <tr><td>Date: <input type="text" id="theDate" /></td></tr>
        <tr><td>Name: <input type="text" id="myName" /></td></tr>
        <tr><td>Company: <input type="text" id="myCompany"/></td></tr>
        <tr><td><input type="button" id="buttonOK" value="OK" /><input type="button" id="buttonCancel" value="Cancel" /></td></tr>
    </table>    
    
    <a id="show" href="#">Show the popup</a>
    
    
    </div>
    </form>
</body>
</html>
